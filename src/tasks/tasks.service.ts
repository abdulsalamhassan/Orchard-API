import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureProjectInOrg(projectId: string, orgId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId: orgId },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
  }

  async create(
    projectId: string,
    orgId: string,
    userId: string,
    dto: CreateTaskDto,
  ) {
    await this.ensureProjectInOrg(projectId, orgId);

    return this.prisma.task.create({
      data: {
        ...dto,
        projectId,
        organizationId: orgId,
        createdById: userId,
      },
    });
  }

  async findAll(projectId: string, orgId: string, query: PaginationQueryDto) {
    await this.ensureProjectInOrg(projectId, orgId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { projectId, organizationId: orgId };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(projectId: string, id: string, orgId: string) {
    await this.ensureProjectInOrg(projectId, orgId);

    const task = await this.prisma.task.findFirst({
      where: { id, projectId, organizationId: orgId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    projectId: string,
    id: string,
    orgId: string,
    dto: UpdateTaskDto,
  ) {
    await this.findOne(projectId, id, orgId);
    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(projectId: string, id: string, orgId: string) {
    await this.findOne(projectId, id, orgId);
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
