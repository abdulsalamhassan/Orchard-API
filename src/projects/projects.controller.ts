import { Controller, UseGuards, Post, Get, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrgMembershipGuard } from '../auth/guards/org-membership.guard';
import { ActiveOrg } from 'src/auth/decorators/active-org.decorator';
import type { RequestWithOrg } from 'src/common/request-with-org.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';

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
    findAll(@ActiveOrg() orgId: string) {
        return this.projectsService.findAll(orgId);
    }
}
