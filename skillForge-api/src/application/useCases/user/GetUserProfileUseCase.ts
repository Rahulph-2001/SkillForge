import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient } from '@prisma/client';
import { AppError, NotFoundError } from '../../../domain/errors/AppError';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { Database } from '../../../infrastructure/database/Database';

export interface UserProfileDTO {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  credits: number;
  walletBalance: number;
  skillsOffered: number;
  rating: number;
  reviewCount: number;
  totalSessionsCompleted: number;
  memberSince: string;
  subscriptionPlan: string;
  subscriptionValidUntil: string | null;
}

@injectable()
export class GetUserProfileUseCase {
  constructor(
    @inject(TYPES.Database) database: Database
  ) {
    this.prisma = database.getClient();
  }

  private prisma: PrismaClient;

  async execute(userId: string): Promise<UserProfileDTO> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        location: true,
        credits: true,
        walletBalance: true,
        rating: true,
        reviewCount: true,
        totalSessionsCompleted: true,
        memberSince: true,
        subscriptionPlan: true,
        subscriptionValidUntil: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Count skills offered by this user
    const skillsOffered = await this.prisma.skill.count({
      where: {
        providerId: userId,
        status: 'approved',
        verificationStatus: 'passed',
        isBlocked: false,
        isDeleted: false,
      } as any,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      credits: user.credits,
      walletBalance: Number(user.walletBalance),
      skillsOffered,
      rating: user.rating ? Number(user.rating) : 0,
      reviewCount: user.reviewCount,
      totalSessionsCompleted: user.totalSessionsCompleted,
      memberSince: user.memberSince.toISOString(),
      subscriptionPlan: user.subscriptionPlan,
      subscriptionValidUntil: user.subscriptionValidUntil?.toISOString() || null,
    };
  }
}
