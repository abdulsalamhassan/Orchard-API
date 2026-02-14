import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateProjectDto, orgId: string, userId: string) {
        return this.prisma.project.create({
            data: {
                ...dto,
                organizationId: orgId,
                createdById: userId,
            },
        });
    }

    async findAll(orgId: string) {
        return this.prisma.project.findMany({
            where: {
                organizationId: orgId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}

