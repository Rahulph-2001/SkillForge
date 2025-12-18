"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const di_1 = require("../../infrastructure/di/di");
const types_1 = require("../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../domain/enums/HttpStatusCode");
const responseHelpers_1 = require("../../shared/http/responseHelpers");
const authMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies?.accessToken;
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        if (!token) {
            const response = (0, responseHelpers_1.errorResponse)('UNAUTHORIZED', 'No token provided', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
            res.status(response.statusCode).json(response.body);
            return;
        }
        // Verify token
        const jwtService = di_1.container.get(types_1.TYPES.IJWTService);
        const decoded = jwtService.verifyToken(token);
        if (!decoded) {
            const response = (0, responseHelpers_1.errorResponse)('UNAUTHORIZED', 'Invalid or expired token', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
            res.status(response.statusCode).json(response.body);
            return;
        }
        // CRITICAL: Check user's current active status from database
        // This ensures suspended users are immediately blocked even if they have a valid token
        const userRepository = di_1.container.get(types_1.TYPES.IUserRepository);
        const user = await userRepository.findById(decoded.userId);
        if (!user) {
            const response = (0, responseHelpers_1.errorResponse)('UNAUTHORIZED', 'User not found', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
            res.status(response.statusCode).json(response.body);
            return;
        }
        // Check if user is suspended or deleted
        if (!user.isActive || user.isDeleted) {
            // Clear cookies to force logout
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
            const response = (0, responseHelpers_1.errorResponse)('FORBIDDEN', 'Your account has been suspended. Please contact support.', HttpStatusCode_1.HttpStatusCode.FORBIDDEN);
            res.status(response.statusCode).json(response.body);
            return;
        }
        // Attach user data to request
        req.user = {
            id: decoded.userId,
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        const response = (0, responseHelpers_1.errorResponse)('UNAUTHORIZED', 'Authentication failed', HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED);
        res.status(response.statusCode).json(response.body);
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map