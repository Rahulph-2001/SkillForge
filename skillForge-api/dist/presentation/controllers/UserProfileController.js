"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserProfileController {
    static async getProviderProfile(req, res) {
        try {
            const { userId } = req.params;
            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                    isDeleted: false,
                    isActive: true,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    bio: true,
                    location: true,
                    rating: true,
                    reviewCount: true,
                    totalSessionsCompleted: true,
                    memberSince: true,
                    verification: true,
                    skillsOffered: true,
                },
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
            return res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch profile',
            });
        }
    }
    /**
     * Get provider reviews
     * GET /api/users/:userId/reviews
     */
    static async getProviderReviews(req, res) {
        try {
            const { userId } = req.params;
            // TODO: Implement reviews model and fetch logic
            // For now, return empty array
            const reviews = [];
            return res.status(200).json({
                success: true,
                data: reviews,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch reviews',
            });
        }
    }
}
exports.UserProfileController = UserProfileController;
//# sourceMappingURL=UserProfileController.js.map