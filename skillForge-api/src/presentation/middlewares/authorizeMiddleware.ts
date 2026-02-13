import { Response, NextFunction } from 'express';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { errorResponse } from '../../shared/http/responseHelpers';
import { UserRole } from '../../domain/enums/UserRole';
import { AuthenticatedRequest } from '../../domain/interfaces/AuthenticatedRequest';

export const authorize = (roles: (UserRole | string)[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            const response = errorResponse(
                'FORBIDDEN',
                'You do not have permission to perform this action',
                HttpStatusCode.FORBIDDEN
            );
            res.status(response.statusCode).json(response.body);
            return;
        }
        next();
    };
};
