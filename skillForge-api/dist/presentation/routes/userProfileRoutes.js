"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../infrastructure/di/container");
const types_1 = require("../../infrastructure/di/types");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(authMiddleware_1.authMiddleware);
// Lazy get controller from DI container to ensure bindings are complete
const getUserProfileController = () => {
    return container_1.container.get(types_1.TYPES.UserProfileController);
};
router.get('/:userId/profile', (req, res, next) => {
    const userProfileController = getUserProfileController();
    userProfileController.getProviderProfile(req, res, next);
});
router.get('/:userId/reviews', (req, res, next) => {
    const userProfileController = getUserProfileController();
    userProfileController.getProviderReviews(req, res, next);
});
exports.default = router;
//# sourceMappingURL=userProfileRoutes.js.map