import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(email: string, passwordHash: string) {
        return this.prisma.user.create({
            data: { email, passwordHash },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async updateRefreshToken(userId: string, refreshTokenHash: string | null) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { refreshTokenHash },
        });
    }
}
