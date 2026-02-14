import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrgMembershipGuard } from '../auth/guards/org-membership.guard';
import { ActiveOrg } from '../auth/decorators/active-org.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { RequestWithOrg } from '../common/request-with-org.interface';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard, OrgMembershipGuard)
@ApiTags('tasks')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-organization-id',
  required: true,
  description: 'Organization scope for the request',
})
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @ActiveOrg() orgId: string,
    @Req() req: RequestWithOrg,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(projectId, orgId, req.user.userId, dto);
  }

  @Get()
  findAll(
    @Param('projectId') projectId: string,
    @ActiveOrg() orgId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.tasksService.findAll(projectId, orgId, query);
  }

  @Get(':id')
  findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @ActiveOrg() orgId: string,
  ) {
    return this.tasksService.findOne(projectId, id, orgId);
  }

  @Patch(':id')
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @ActiveOrg() orgId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(projectId, id, orgId, dto);
  }

  @Delete(':id')
  remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @ActiveOrg() orgId: string,
  ) {
    return this.tasksService.remove(projectId, id, orgId);
  }
}
