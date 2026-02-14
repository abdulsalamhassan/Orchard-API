// src/common/middleware/org-context.middleware.ts

import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { RequestWithOrg } from '../request-with-org.interface';

@Injectable()
export class OrgContextMiddleware implements NestMiddleware {
    use(req: RequestWithOrg, res: Response, next: NextFunction) {
        const orgId = req.headers['x-organization-id'];

        if (!orgId || typeof orgId !== 'string') {
            throw new BadRequestException('x-organization-id header missing');
        }

        req.activeOrgId = orgId;
        next();
    }
}
