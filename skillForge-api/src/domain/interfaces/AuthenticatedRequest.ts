import { Request } from 'express';
import { UserRole } from '../enums/UserRole';

export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        userId: string;
        email: string;
        role: UserRole | string;
    };
}
