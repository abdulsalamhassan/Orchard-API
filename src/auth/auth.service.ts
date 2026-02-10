import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) { }

    async register(email: string, password: string) {
        const passwordHash = await bcrypt.hash(password, 10);

        return this.usersService.create(email, passwordHash);
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }
}
