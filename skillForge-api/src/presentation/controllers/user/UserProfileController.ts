import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../config/messages';
import { PrismaClient } from '@prisma/client';

@injectable()
export class UserProfileController {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) { }

  getProviderProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;

      const user = await this.prisma.user.findUnique({
        where: { id: userId, isDeleted: false, isActive: true },
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
        const response = this.responseBuilder.error(
          'USER_NOT_FOUND',
          ERROR_MESSAGES.USER.NOT_FOUND,
          HttpStatusCode.NOT_FOUND
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      const response = this.responseBuilder.success(
        user,
        SUCCESS_MESSAGES.USER.PROFILE_FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      const user = await this.prisma.user.findUnique({
        where: { id: userId, isDeleted: false, isActive: true },
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
          skillsLearning: true,
          credits: true,
          subscriptionPlan: true,
        },
      });

      if (!user) {
        const response = this.responseBuilder.error(
          'USER_NOT_FOUND',
          ERROR_MESSAGES.USER.NOT_FOUND,
          HttpStatusCode.NOT_FOUND
        );
        res.status(response.statusCode).json(response.body);
        return;
      }

      const response = this.responseBuilder.success(
        user,
        SUCCESS_MESSAGES.USER.PROFILE_FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { name, bio, location } = req.body;

      const updateData: any = {};
      if (name) updateData.name = name;
      if (bio !== undefined) updateData.bio = bio;
      if (location !== undefined) updateData.location = location;

      const user = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          bio: true,
          location: true,
        },
      });

      const response = this.responseBuilder.success(
        user,
        SUCCESS_MESSAGES.USER.PROFILE_UPDATED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  getProviderReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const reviews: any[] = [];

      const response = this.responseBuilder.success(
        reviews,
        SUCCESS_MESSAGES.USER.REVIEWS_FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
}
