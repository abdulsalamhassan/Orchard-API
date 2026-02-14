import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class OrganizationsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(name: string, userId: string) {
        return this.prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: { name },
            });

            await tx.organizationMember.create({
                data: {
                    userId,
                    organizationId: organization.id,
                    role: Role.OWNER,
                },
            });

            return organization;
        });
    }

    async debugMembers() {
        return this.prisma.organizationMember.findMany();
    }

}
