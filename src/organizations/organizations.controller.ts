import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiTags('organizations')
@ApiBearerAuth()
@ApiHeader({
    name: 'x-organization-id',
    required: false,
    description: 'Active organization for scoped routes',
})
export class OrganizationsController {
    constructor(private readonly orgService: OrganizationsService) { }

    @Post()
    async create(
        @Body() dto: CreateOrganizationDto,
        @CurrentUser() user: any,
    ) {
        return this.orgService.create(dto.name, user.userId);
    }

    @Get('debug')
    async debug() {
        return this.orgService.debugMembers();
    }

}
