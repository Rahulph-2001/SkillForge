"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthMiddleware = void 0;
const di_1 = require("../../infrastructure/di/di");
const types_1 = require("../../infrastructure/di/types");
const optionalAuthMiddleware = async (req, _res, next) => {
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
        const jwtService = di_1.container.get(types_1.TYPES.IJWTService);
        const decoded = jwtService.verifyToken(token);
        if (!decoded) {
            return next();
        }
        // Check user's current active status from database
        const userRepository = di_1.container.get(types_1.TYPES.IUserRepository);
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
    }
    catch (error) {
        // If any error occurs (e.g. invalid token format), just proceed as unauthenticated
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
//# sourceMappingURL=optionalAuthMiddleware.js.map