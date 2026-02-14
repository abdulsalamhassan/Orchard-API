import { Request } from 'express';

export interface RequestWithOrg extends Request {
    user: {
        userId: string;
        email: string;
    };
    activeOrgId?: string;
}
