import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { IReviewRepository } from '../../../domain/repositories/IReviewRepository';
import { Review } from '../../../domain/entities/Review';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { PrismaClient } from '@prisma/client';
import { ForbiddenError } from '../../../domain/errors/AppError';

@injectable()
export class ReviewRepository extends BaseRepository<Review> implements IReviewRepository {
    constructor(@inject(TYPES.Database) db: Database) {
        super(db, 'review');
    }

    private mapToDomain(data: any): Review {
        return new Review({
            id: data.id,
            bookingId: data.bookingId,
            providerId: data.providerId,
            learnerId: data.learnerId,
            skillId: data.skillId,
            rating: data.rating,
            review: data.review,
            createdAt: data.createdAt,
        });
    }

    async create(review: Review): Promise<Review> {
        // This method is required by interface but for full logic we use createWithStats
        // We can just call createWithStats here or throw error
        return this.createWithStats(review);
    }

    async createWithStats(review: Review): Promise<Review> {
        const prisma = this.prisma as PrismaClient;

        return await prisma.$transaction(async (tx) => {
            // 1. Create Review
            const newReview = await tx.review.create({
                data: {
                    id: review.id,
                    bookingId: review.bookingId,
                    providerId: review.providerId,
                    learnerId: review.learnerId,
                    skillId: review.skillId,
                    rating: review.rating,
                    review: review.review,
                    createdAt: review.createdAt,
                },
            });

            // 2. Update Provider Stats
            const providerReviews = await tx.review.aggregate({
                where: { providerId: review.providerId },
                _avg: { rating: true },
                _count: { rating: true },
            });


            await tx.user.update({
                where: { id: review.providerId },
                data: {
                    rating: providerReviews._avg.rating || 0,
                    reviewCount: providerReviews._count.rating || 0,
                },
            });

            // 3. Update Skill Stats
            const skillReviews = await tx.review.aggregate({
                where: { skillId: review.skillId },
                _avg: { rating: true },
            });

            await tx.skill.update({
                where: { id: review.skillId },
                data: {
                    rating: skillReviews._avg.rating || 0,
                },
            });

            return this.mapToDomain(newReview);
        });
    }

    async findByBookingId(bookingId: string): Promise<Review | null> {
        const prisma = this.prisma as PrismaClient;
        const data = await prisma.review.findUnique({
            where: { bookingId },
        });
        return data ? this.mapToDomain(data) : null;
    }

    async findByProviderId(providerId: string): Promise<Review[]> {
        const prisma = this.prisma as PrismaClient;
        const data = await prisma.review.findMany({
            where: { providerId },
            orderBy: { createdAt: 'desc' },
        });
        return data.map((item: any) => this.mapToDomain(item));
    }

    async findByLearnerId(learnerId: string): Promise<Review[]> {
        const prisma = this.prisma as PrismaClient;
        const data = await prisma.review.findMany({
            where: { learnerId },
            orderBy: { createdAt: 'desc' },
        });
        return data.map((item: any) => this.mapToDomain(item));
    }
}
