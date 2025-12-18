import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { Booking } from '../../../domain/entities/Booking';
import { CreateBookingRequestDTO } from '../../dto/booking/CreateBookingRequestDTO';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { NotFoundError, ValidationError, ForbiddenError } from '../../../domain/errors/AppError';
import { BookingValidator } from '../../../shared/validators/BookingValidator';
import { DateTimeUtils } from '../../../shared/utils/DateTimeUtils';

@injectable()
export class CreateBookingUseCase {
    constructor(
        @inject(TYPES.IBookingRepository) private readonly bookingRepository: IBookingRepository,
        @inject(TYPES.ISkillRepository) private readonly skillRepository: ISkillRepository,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.IAvailabilityRepository) private readonly availabilityRepository: IAvailabilityRepository,
        @inject(TYPES.IBookingMapper) private readonly bookingMapper: IBookingMapper
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

        // 7. Get provider availability settings
        const availability = await this.availabilityRepository.findByProviderId(request.providerId);
        if (availability) {
            // Validate booking is not in the past
            const pastValidation = BookingValidator.validateDateNotInPast(
                request.preferredDate,
                request.preferredTime,
                availability.timezone
            );
            if (!pastValidation.valid) {
                throw new ValidationError(pastValidation.error || 'Booking date must be in the future');
            }

            // Validate advance booking window
            const bookingDate = DateTimeUtils.parseDateTime(request.preferredDate, request.preferredTime);
            const advanceValidation = BookingValidator.validateWithinAdvanceBookingWindow(
                bookingDate,
                availability.minAdvanceBooking,
                availability.maxAdvanceBooking
            );
            if (!advanceValidation.valid) {
                throw new ValidationError(advanceValidation.error || 'Booking outside allowed time window');
            }

            // Validate against blocked dates
            const blockedDates = availability.blockedDates as any[];
            const blockedValidation = BookingValidator.validateAgainstBlockedDates(
                request.preferredDate,
                blockedDates
            );
            if (!blockedValidation.valid) {
                throw new ValidationError(blockedValidation.error || 'Provider unavailable on this date');
            }

            // Validate session doesn't cross midnight
            const midnightValidation = BookingValidator.validateSessionWithinSameDay(
                request.preferredDate,
                request.preferredTime,
                skill.durationHours,
                availability.timezone
            );
            if (!midnightValidation.valid) {
                throw new ValidationError(midnightValidation.error || 'Session cannot cross midnight');
            }

            // Validate within working hours
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

            // Check for overlapping bookings with buffer
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

            // Check max sessions per day if configured
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

        // 8. Calculate start and end times for the booking
        const [startHours, startMinutes] = request.preferredTime.split(':').map(Number);
        const startAt = new Date(request.preferredDate);
        startAt.setHours(startHours, startMinutes, 0, 0);

        const endAt = DateTimeUtils.addHours(startAt, skill.durationHours);

        // 9. Create booking entity
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

        // 9. Create booking with transaction (deducts credits from learner)
        const createdBooking = await this.bookingRepository.createTransactional(booking, sessionCost);

        // TODO: Send notification to provider
        // TODO: Send confirmation to learner

        return this.bookingMapper.toDTO(createdBooking);
    }
}
