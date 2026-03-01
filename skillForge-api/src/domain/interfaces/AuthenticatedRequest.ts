import { type Request } from 'express';
import { type UserRole } from '../enums/UserRole';

export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        userId: string;
        email: string;
        role: UserRole | string;
    };
}
