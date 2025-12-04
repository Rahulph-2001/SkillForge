import { injectable, inject } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IBookingMapper } from '../../mappers/interfaces/IBookingMapper';
import { ICreateBookingUseCase } from './interfaces/ICreateBookingUseCase';
import { CreateBookingRequestDTO } from '../../dto/booking/CreateBookingRequestDTO';
import { BookingResponseDTO } from '../../dto/booking/BookingResponseDTO';
import { Booking, BookingStatus } from '../../../domain/entities/Booking';
import { NotFoundError, ValidationError } from '../../../domain/errors/AppError';

@injectable()
export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.IBookingMapper) private bookingMapper: IBookingMapper
  ) {}

  async execute(request: CreateBookingRequestDTO): Promise<BookingResponseDTO> {
    const { learnerId, skillId, providerId, preferredDate, preferredTime, message } = request;
    
    const skill = await this.skillRepository.findById(skillId);
    
    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    if (skill.status !== 'approved') {
      throw new ValidationError('This skill is not available for booking');
    }

    if (skill.isBlocked) {
      throw new ValidationError('This skill is currently blocked');
    }
    
    if (skill.providerId !== providerId) {
      throw new ValidationError('Invalid provider for this skill');
    }

    // Validate learner is not the provider
    if (learnerId === providerId) {
      throw new ValidationError('You cannot book your own skill');
    }

    // Calculate session cost
    const sessionCost = skill.creditsPerHour * skill.durationHours;

    // Validate learner has sufficient credits
    const learner = await this.userRepository.findById(learnerId);
    
    if (!learner) {
      throw new NotFoundError('Learner not found');
    }

    if (learner.credits < sessionCost) {
      throw new ValidationError('Insufficient credits to book this session');
    }

    // Validate date is in the future
    const preferredDateTime = new Date(`${preferredDate}T${preferredTime}`);
    if (preferredDateTime <= new Date()) {
      throw new ValidationError('Preferred date and time must be in the future');
    }

    // Create booking entity
    const booking = Booking.create({
      id: uuidv4(),
      learnerId,
      skillId,
      providerId,
      preferredDate,
      preferredTime,
      message: message || null,
      status: BookingStatus.PENDING,
      sessionCost,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Persist booking
    const createdBooking = await this.bookingRepository.create(booking);

    // Return DTO
    return this.bookingMapper.toDTO(createdBooking);
  }
}
