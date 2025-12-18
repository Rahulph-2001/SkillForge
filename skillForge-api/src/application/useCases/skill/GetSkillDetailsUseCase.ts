import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { NotFoundError } from '../../../domain/errors/AppError';
import { IGetSkillDetailsUseCase } from './interfaces/IGetSkillDetailsUseCase';
import { SkillDetailsDTO } from '../../dto/skill/SkillDetailsResponseDTO';
import { ISkillDetailsMapper } from '../../mappers/interfaces/ISkillDetailsMapper';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
@injectable()
export class GetSkillDetailsUseCase implements IGetSkillDetailsUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IAvailabilityRepository) private availabilityRepository: IAvailabilityRepository,
    @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.ISkillDetailsMapper) private skillDetailsMapper: ISkillDetailsMapper
  ) { }

  async execute(skillId: string): Promise<SkillDetailsDTO> {
    const skill = await this.skillRepository.findById(skillId);
    if (!skill) throw new NotFoundError('Skill not found');

    // Check if skill is active
    if (skill.status !== 'approved' || skill.isBlocked) {
      throw new NotFoundError('This skill is currently not available');
    }

    const provider = await this.userRepository.findById(skill.providerId);
    if (!provider) throw new NotFoundError('Provider not found');

    // 1. Get Provider Statistics (Rating)
    const providerSkills = await this.skillRepository.findByProviderId(skill.providerId);
    const validSkills = providerSkills.filter(s => s.status === 'approved' && !s.isBlocked);

    const totalRating = validSkills.reduce((sum, s) => sum + (s.rating || 0), 0);
    const avgRating = validSkills.length ? totalRating / validSkills.length : 0;
    const reviewCount = validSkills.reduce((sum, s) => sum + (s.totalSessions || 0), 0); // Approx logic

    // 2. Fetch Availability & Booked Slots
    const availability = await this.availabilityRepository.findByProviderId(skill.providerId);

    let enrichedAvailability = null;
    if (availability) {
      // Calculate date range (Next 30 days)
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);

      // Fetch existing confirmed/pending bookings
      const activeBookings = await this.bookingRepository.findInDateRange(
        skill.providerId,
        today,
        nextMonth
      );

      // Map to simple objects for Frontend to gray out
      // User Request: Only show bookings related to THIS skill.
      const bookedSlots = activeBookings
        .filter((b: any) => b.skillId === skillId)
        .map((b: any) => ({
          id: b.id,
          title: b.skillTitle || 'Session',
          date: b.preferredDate,
          startTime: b.preferredTime,
          endTime: this.calculateEndTime(b.preferredTime, b.duration || (skill.durationHours * 60))
        }));

      enrichedAvailability = {
        ...availability,
        bookedSlots // <-- Crucial for "Industrial" feel
      };
    }

    return this.skillDetailsMapper.toDTO(
      skill,
      provider,
      { rating: Number(avgRating.toFixed(1)), reviewCount },
      enrichedAvailability
    );
  }

  private calculateEndTime(startTime: string, durationMinutes: number): string {
    const [h, m] = startTime.split(':').map(Number);
    const totalMinutes = h * 60 + m + durationMinutes;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  }
}