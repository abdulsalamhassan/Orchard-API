// src/organizations/guards/org-membership.guard.ts

import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestWithOrg } from '../../common/request-with-org.interface';

@Injectable()
export class OrgMembershipGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<RequestWithOrg>();

        const { user, activeOrgId } = req;

        if (!activeOrgId) {
            throw new ForbiddenException('No active organization');
        }

        const org = await this.prisma.organization.findUnique({
            where: { id: activeOrgId },
        });

        if (!org) {
            throw new NotFoundException('Organization not found');
        }

        const membership = await this.prisma.organizationMember.findFirst({
            where: {
                userId: user.userId,
                organizationId: activeOrgId,
            },
        });

        if (!membership) {
            throw new ForbiddenException('Not a member of this organization');
        }

        return true;
    }
}
