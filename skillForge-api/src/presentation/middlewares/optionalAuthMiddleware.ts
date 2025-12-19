import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/di';
import { TYPES } from '../../infrastructure/di/types';
import { IJWTService } from '../../domain/services/IJWTService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export const optionalAuthMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token = req.cookies?.accessToken;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return next();
        }

        // Verify token
        const jwtService = container.get<IJWTService>(TYPES.IJWTService);
        const decoded = jwtService.verifyToken(token);

        if (!decoded) {
            return next();
        }

        // Check user's current active status from database
        const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
        const user = await userRepository.findById(decoded.userId);

        if (!user || !user.isActive || user.isDeleted) {
            return next();
        }

        // Attach user data to request
        (req as any).user = {
            id: decoded.userId,
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    } catch (error) {
        // If any error occurs (e.g. invalid token format), just proceed as unauthenticated
        next();
    }
};
