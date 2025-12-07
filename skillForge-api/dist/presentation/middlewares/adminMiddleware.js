"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const HttpStatusCode_1 = require("../../domain/enums/HttpStatusCode");
const UserRole_1 = require("../../domain/enums/UserRole");
const adminMiddleware = (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({
                success: false,
                error: 'Authentication required',
            });
            return;
        }
        if (user.role !== UserRole_1.UserRole.ADMIN) {
            res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
                success: false,
                error: 'Access denied. Admin privileges required.',
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN).json({
            success: false,
            error: 'Authorization failed',
        });
    }
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=adminMiddleware.js.map