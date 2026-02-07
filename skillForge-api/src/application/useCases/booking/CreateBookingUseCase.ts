import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { Booking } from '../../../domain/entities/Booking';
import { CreateBookingRequestDTO } from '../../dto/booking/CreateBookingRequestDTO';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { NotFoundError, ValidationError, ForbiddenError } from '../../../domain/errors/AppError';
import { BookingValidator } from '../../../shared/validators/BookingValidator';
import { DateTimeUtils } from '../../../shared/utils/DateTimeUtils';
import { ICreateBookingUseCase } from './interfaces/ICreateBookingUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
import { NotificationType } from '../../../domain/entities/Notification';

@injectable()
export class CreateBookingUseCase implements ICreateBookingUseCase {
    constructor(
        @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
        @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.IAvailabilityRepository) private readonly availabilityRepository: IAvailabilityRepository,
        @inject(TYPES.IEscrowRepository) private readonly escrowRepository: IEscrowRepository,
        @inject(TYPES.IBookingMapper) private readonly bookingMapper: IBookingMapper,
        @inject(TYPES.INotificationService) private readonly notificationService: INotificationService
    ) { }

    async execute(request: CreateBookingRequestDTO): Promise<BookingResponseDTO> {
        // 1. Validate required fields
        const fieldsValidation = BookingValidator.validateRequiredFields(request);
        if (!fieldsValidation.valid) {
            throw new ValidationError(fieldsValidation.error || 'Invalid booking request');
        }

        // 2. Validate date and time format
        const formatValidation = BookingValidator.validateDateTimeFormat(
            request.preferredDate,
            request.preferredTime
        );
        if (!formatValidation.valid) {
            throw new ValidationError(formatValidation.error || 'Invalid date or time format');
        }

        // 3. Validate not self-booking
        const selfBookingValidation = BookingValidator.validateNotSelfBooking(
            request.learnerId,
            request.providerId
        );
        if (!selfBookingValidation.valid) {
            throw new ValidationError(selfBookingValidation.error || 'Cannot book your own skill');
        }

        // 4. Verify skill exists and belongs to provider
        const skill = await this.skillRepository.findById(request.skillId);
        if (!skill) {
            throw new NotFoundError('Skill not found');
        }

        if (skill.providerId !== request.providerId) {
            throw new ValidationError('Skill does not belong to the specified provider');
        }

        // 5. Verify learner exists and has sufficient credits
        const learner = await this.userRepository.findById(request.learnerId);
        if (!learner) {
            throw new NotFoundError('Learner not found');
        }

        const sessionCost = skill.creditsPerHour * skill.durationHours;
        if (learner.credits < sessionCost) {
            throw new ValidationError(`Insufficient credits. Required: ${sessionCost}, Available: ${learner.credits}`);
        }

        // 6. Check for duplicate booking
        const duplicate = await this.bookingRepository.findDuplicateBooking(
            request.learnerId,
            request.skillId,
            request.preferredDate,
            request.preferredTime
        );
        if (duplicate) {
            throw new ValidationError('You already have a booking for this skill at this time');
        }

        // 7. Get provider availability settings - REQUIRED for booking
        const availability = await this.availabilityRepository.findByProviderId(request.providerId);
        if (!availability) {
            throw new ValidationError('Provider has not set their availability. Please contact the provider or try another skill.');
        }

        // 8. Validate availability settings
        if (availability) {
            const pastValidation = BookingValidator.validateDateNotInPast(
                request.preferredDate,
                request.preferredTime,
                availability.timezone
            );
            if (!pastValidation.valid) {
                throw new ValidationError(pastValidation.error || 'Booking date must be in the future');
            }

            const bookingDate = DateTimeUtils.parseDateTime(request.preferredDate, request.preferredTime);
            const advanceValidation = BookingValidator.validateWithinAdvanceBookingWindow(
                bookingDate,
                availability.minAdvanceBooking,
                availability.maxAdvanceBooking
            );
            if (!advanceValidation.valid) {
                throw new ValidationError(advanceValidation.error || 'Booking outside allowed time window');
            }

            const blockedDates = availability.blockedDates as any[];
            const blockedValidation = BookingValidator.validateAgainstBlockedDates(
                request.preferredDate,
                blockedDates
            );
            if (!blockedValidation.valid) {
                throw new ValidationError(blockedValidation.error || 'Provider unavailable on this date');
            }

            const midnightValidation = BookingValidator.validateSessionWithinSameDay(
                request.preferredDate,
                request.preferredTime,
                skill.durationHours,
                availability.timezone
            );
            if (!midnightValidation.valid) {
                throw new ValidationError(midnightValidation.error || 'Session cannot cross midnight');
            }

            const dayOfWeek = new Date(request.preferredDate).toLocaleDateString('en-US', { weekday: 'long' });
            const weeklySchedule = availability.weeklySchedule as any;
            const daySchedule = weeklySchedule[dayOfWeek];

            if (daySchedule) {
                const workingHoursValidation = BookingValidator.validateWithinWorkingHours(
                    request.preferredTime,
                    skill.durationHours,
                    daySchedule
                );
                if (!workingHoursValidation.valid) {
                    throw new ValidationError(workingHoursValidation.error || 'Outside provider working hours');
                }
            }

            const [startHours, startMinutes] = request.preferredTime.split(':').map(Number);
            const startDate = new Date(request.preferredDate);
            startDate.setHours(startHours, startMinutes, 0, 0);

            const endDate = DateTimeUtils.addHours(startDate, skill.durationHours);
            const endTime = DateTimeUtils.formatTime(endDate);

            const overlapping = await this.bookingRepository.findOverlappingWithBuffer(
                request.providerId,
                startDate,
                request.preferredTime,
                endTime,
                availability.bufferTime
            );

            if (overlapping.length > 0) {
                throw new ValidationError('This time slot conflicts with an existing booking');
            }

            if (availability.maxSessionsPerDay) {
                const sessionsCount = await this.bookingRepository.countActiveBookingsByProviderAndDate(
                    request.providerId,
                    request.preferredDate
                );
                if (sessionsCount >= availability.maxSessionsPerDay) {
                    throw new ValidationError(`Provider has reached maximum sessions for this day (${availability.maxSessionsPerDay})`);
                }
            }
        }

        // 9. Calculate start and end times for the booking
        const [startHours, startMinutes] = request.preferredTime.split(':').map(Number);
        const startAt = new Date(request.preferredDate);
        startAt.setHours(startHours, startMinutes, 0, 0);

        const endAt = DateTimeUtils.addHours(startAt, skill.durationHours);

        // 10. Create booking entity
        const booking = Booking.create({
            learnerId: request.learnerId,
            skillId: request.skillId,
            providerId: request.providerId,
            preferredDate: request.preferredDate,
            preferredTime: request.preferredTime,
            message: request.message || null,
            sessionCost,
            status: 'pending' as any,
            startAt,
            endAt,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // 11. Create booking with escrow hold (holds credits from learner)
        const createdBooking = await this.bookingRepository.createWithEscrow(booking, sessionCost);

        // 12. Send notification to provider about new booking request
        const formattedDate = new Date(request.preferredDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });

        await this.notificationService.send({
            userId: request.providerId,
            type: NotificationType.BOOKING_REQUEST,
            title: 'New Booking Request',
            message: `${learner.name} requested a ${skill.title} session for ${formattedDate} at ${request.preferredTime}`,
            data: {
                bookingId: createdBooking.id,
                skillId: request.skillId,
                learnerId: request.learnerId,
                preferredDate: request.preferredDate,
                preferredTime: request.preferredTime
            },
        });

        return this.bookingMapper.toDTO(createdBooking);
    }
}