import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { BookingStatus } from '../../../domain/entities/Booking';
import { NotFoundError, ValidationError, ForbiddenError } from '../../../domain/errors/AppError';
import { ICompleteSessionUseCase, CompleteSessionRequestDTO } from './interfaces/ICompleteSessionUseCase';
import { Database } from '../../../infrastructure/database/Database';
import { PrismaClient, Prisma } from '@prisma/client';
import { INotificationService } from '../../../domain/services/INotificationService';
import { NotificationType } from '../../../domain/entities/Notification';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';

@injectable()
export class CompleteSessionUseCase implements ICompleteSessionUseCase {
    constructor(
        @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
        @inject(TYPES.IEscrowRepository) private readonly escrowRepository: IEscrowRepository,
        @inject(TYPES.IBookingMapper) private readonly bookingMapper: IBookingMapper,
        @inject(TYPES.Database) private readonly database: Database,
        @inject(TYPES.INotificationService) private readonly notificationService: INotificationService,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository
    ) { }

    async execute(request: CompleteSessionRequestDTO): Promise<BookingResponseDTO> {
        const { bookingId, completedBy } = request;

        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new NotFoundError('Booking not found');
        }

        if (booking.providerId !== completedBy && booking.learnerId !== completedBy) {
            throw new ForbiddenError('You are not authorized to complete this session');
        }

        if (!booking.canBeCompleted()) {
            throw new ValidationError(`cannot complete booking with status: ${booking.status}`);
        }

        // Use transaction to ensure all updates are atomic
        const prisma = this.database.getClient() as PrismaClient;

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Release escrow credits to provider
            await this.escrowRepository.releaseCredits(bookingId);

            // 2. Update booking status to completed
            await tx.booking.update({
                where: { id: bookingId },
                data: { status: BookingStatus.COMPLETED },
            });

            // 3. Increment provider's totalSessionsCompleted
            await tx.user.update({
                where: { id: booking.providerId },
                data: { totalSessionsCompleted: { increment: 1 } },
            });

            // 4. Increment learner's totalSessionsCompleted
            await tx.user.update({
                where: { id: booking.learnerId },
                data: { totalSessionsCompleted: { increment: 1 } },
            });

            // 5. Increment skill's totalSessions
            await tx.skill.update({
                where: { id: booking.skillId },
                data: { totalSessions: { increment: 1 } },
            });
        });

        // Fetch user and skill details for notifications
        const learner = await this.userRepository.findById(booking.learnerId);
        const provider = await this.userRepository.findById(booking.providerId);
        const skill = await this.skillRepository.findById(booking.skillId);

        // Send notification to learner about session completion
        await this.notificationService.send({
            userId: booking.learnerId,
            type: NotificationType.SESSION_COMPLETED,
            title: 'Session Completed',
            message: `Your ${skill?.title || 'skill'} session with ${provider?.name || 'provider'} has been completed`,
            data: { bookingId: booking.id, skillId: booking.skillId },
        });

        // Send notification to provider about session completion
        await this.notificationService.send({
            userId: booking.providerId,
            type: NotificationType.SESSION_COMPLETED,
            title: 'Session Completed',
            message: `Your ${skill?.title || 'skill'} session with ${learner?.name || 'learner'} has been completed`,
            data: { bookingId: booking.id, skillId: booking.skillId },
        });

        // Send notification to provider about credits earned
        await this.notificationService.send({
            userId: booking.providerId,
            type: NotificationType.CREDITS_EARNED,
            title: 'Credits Earned',
            message: `You earned ${booking.sessionCost} credits from your session with ${learner?.name || 'learner'}`,
            data: { bookingId: booking.id, creditsEarned: booking.sessionCost },
        });

        // Fetch the updated booking for response
        const updatedBooking = await this.bookingRepository.findById(bookingId);
        return this.bookingMapper.toDTO(updatedBooking!);
    }
}
