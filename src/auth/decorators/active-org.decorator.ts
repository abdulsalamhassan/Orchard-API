// src/common/decorators/active-org.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithOrg } from 'src/common/request-with-org.interface';

export const ActiveOrg = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<RequestWithOrg>();
        return request.activeOrgId;
    },
);
