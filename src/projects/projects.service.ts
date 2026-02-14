import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

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

    async findAll(orgId: string, query: PaginationQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;

        const [data, total] = await this.prisma.$transaction([
            this.prisma.project.findMany({
                where: {
                    organizationId: orgId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.project.count({
                where: {
                    organizationId: orgId,
                },
            }),
        ]);

        return {
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string, orgId: string) {
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                organizationId: orgId,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    async update(id: string, orgId: string, dto: UpdateProjectDto) {
        await this.findOne(id, orgId);
        return this.prisma.project.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, orgId: string) {
        await this.findOne(id, orgId);
        return this.prisma.project.delete({
            where: { id },
        });
    }
}

