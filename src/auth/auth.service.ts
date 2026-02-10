import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(email: string, password: string) {
        const passwordHash = await bcrypt.hash(password, 10);
        return this.usersService.create(email, passwordHash);
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);

        const tokens = await this.generateTokens(user.id, user.email);
        await this.storeRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        return user;
    }



    async generateTokens(userId: string, email: string) {
        const accessToken = await this.jwtService.signAsync(
            { sub: userId, email },
            { expiresIn: '15m' },
        );

        const refreshToken = await this.jwtService.signAsync(
            {
                sub: userId,
                jti: uuidv4(), // 🔥 critical
            },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            },
        );

        return { accessToken, refreshToken };
    }


    async storeRefreshToken(userId: string, refreshToken: string) {
        const hash = await bcrypt.hash(refreshToken, 10);
        await this.usersService.updateRefreshToken(userId, hash);
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const user = await this.usersService.findById(payload.sub);
            if (!user || !user.refreshTokenHash) {
                throw new UnauthorizedException();
            }

            const valid = await bcrypt.compare(
                refreshToken,
                user.refreshTokenHash,
            );

            if (!valid) {
                throw new UnauthorizedException();
            }

            const tokens = await this.generateTokens(user.id, user.email);
            await this.storeRefreshToken(user.id, tokens.refreshToken);

            return tokens;
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(userId: string) {
        await this.usersService.updateRefreshToken(userId, null);
    }


}
