
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
import { PrismaClient } from '@prisma/client';

@injectable()
export class CompleteSessionUseCase implements ICompleteSessionUseCase {
    constructor(
        @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
        @inject(TYPES.IEscrowRepository) private readonly escrowRepository: IEscrowRepository,
        @inject(TYPES.IBookingMapper) private readonly bookingMapper: IBookingMapper,
        @inject(TYPES.Database) private readonly database: Database,
    ) { }

    async execute(request: CompleteSessionRequestDTO): Promise<BookingResponseDTO> {
        const { bookingId, completedBy } = request;

        const booking = await this.bookingRepository.findById(bookingId)
        if (!booking) {
            throw new NotFoundError('Booking not found')
        }

        if (booking.providerId !== completedBy && booking.learnerId !== completedBy) {
            throw new ForbiddenError('You are not authorized to complete this session')
        }

        if (!booking.canBeCompleted()) {
            throw new ValidationError(`cannot complete booking with status: ${booking.status}`)
        }

        // Use transaction to ensure all updates are atomic
        const prisma = this.database.getClient() as PrismaClient;

        await prisma.$transaction(async (tx) => {
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

        // Fetch the updated booking for response
        const updatedBooking = await this.bookingRepository.findById(bookingId);
        return this.bookingMapper.toDTO(updatedBooking!);
    }
}
