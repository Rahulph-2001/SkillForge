import { type Request, type Response, type NextFunction } from 'express';
import { container } from '../../infrastructure/di/di';
import { TYPES } from '../../infrastructure/di/types';
import { type IJWTService } from '../../domain/services/IJWTService';
import { type IUserRepository } from '../../domain/repositories/IUserRepository';

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
        req.user = {
            id: decoded.userId,
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        // If any error occurs (e.g. invalid token format), just proceed as unauthenticated
        next();
    }
};
