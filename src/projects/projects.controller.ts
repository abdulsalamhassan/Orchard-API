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
import { ActiveOrg } from 'src/auth/decorators/active-org.decorator';
import type { RequestWithOrg } from 'src/common/request-with-org.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard, OrgMembershipGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    create(
        @ActiveOrg() orgId: string,
        @Req() req: RequestWithOrg,
        @Body() dto: CreateProjectDto,
    ) {
        return this.projectsService.create(dto, orgId, req.user.userId);
    }

    @Get()
    findAll(@ActiveOrg() orgId: string, @Query() query: PaginationQueryDto) {
        return this.projectsService.findAll(orgId, query);
    }

    @Get(':id')
    findOne(@ActiveOrg() orgId: string, @Param('id') id: string) {
        return this.projectsService.findOne(id, orgId);
    }

    @Patch(':id')
    update(
        @ActiveOrg() orgId: string,
        @Param('id') id: string,
        @Body() dto: UpdateProjectDto,
    ) {
        return this.projectsService.update(id, orgId, dto);
    }

    @Delete(':id')
    remove(@ActiveOrg() orgId: string, @Param('id') id: string) {
        return this.projectsService.remove(id, orgId);
    }
}
