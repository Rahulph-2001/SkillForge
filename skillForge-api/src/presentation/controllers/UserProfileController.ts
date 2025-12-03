import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserProfileController {
  /**
   * Get public provider profile
   * GET /api/users/:userId/profile
   */
  static async getProviderProfile(req: Request, res: Response) {
    console.log('🟡 [UserProfileController] getProviderProfile called');
    
    try {
      const { userId } = req.params;
      console.log('🟡 [UserProfileController] Fetching profile for user:', userId);

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
        console.error('❌ [UserProfileController] User not found');
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      console.log('✅ [UserProfileController] Profile fetched successfully');

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      console.error('❌ [UserProfileController] Error:', error);
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
  static async getProviderReviews(req: Request, res: Response) {
    console.log('🟡 [UserProfileController] getProviderReviews called');
    
    try {
      const { userId } = req.params;
      console.log('🟡 [UserProfileController] Fetching reviews for user:', userId);

      // TODO: Implement reviews model and fetch logic
      // For now, return empty array
      const reviews: any[] = [];

      console.log('✅ [UserProfileController] Reviews fetched successfully');

      return res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error: any) {
      console.error('❌ [UserProfileController] Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch reviews',
      });
    }
  }
}
