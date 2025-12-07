"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserProfileController_1 = require("../controllers/UserProfileController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(authMiddleware_1.authMiddleware);
router.get('/:userId/profile', UserProfileController_1.UserProfileController.getProviderProfile);
router.get('/:userId/reviews', UserProfileController_1.UserProfileController.getProviderReviews);
exports.default = router;
//# sourceMappingURL=userProfileRoutes.js.map