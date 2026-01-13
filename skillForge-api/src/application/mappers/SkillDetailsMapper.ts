import { injectable } from 'inversify';
import { Skill } from '../../domain/entities/Skill';
import { User } from '../../domain/entities/User';
import { ProviderAvailability } from '../../domain/entities/ProviderAvailability';
import { SkillDetailsDTO } from '../dto/skill/SkillDetailsResponseDTO';
import { ISkillDetailsMapper } from './interfaces/ISkillDetailsMapper';

@injectable()
export class SkillDetailsMapper implements ISkillDetailsMapper {
  public toDTO(skill: Skill, provider: User, providerStats: { rating: number; reviewCount: number }, availability?: ProviderAvailability): SkillDetailsDTO {
    return {
      id: skill.id,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      level: skill.level,
      durationHours: skill.durationHours,
      creditsPerHour: skill.creditsPerHour,
      imageUrl: skill.imageUrl,
      tags: skill.tags,
      rating: Number(skill.rating) || 0,
      totalSessions: skill.totalSessions,
      provider: {
        id: provider.id,
        name: provider.name,
        email: provider.email.value,
        avatarUrl: provider.avatarUrl,
        rating: Number(providerStats.rating) || 0,
        reviewCount: providerStats.reviewCount,
      },
      availability: availability ? {
        weeklySchedule: availability.weeklySchedule,
        blockedDates: availability.blockedDates.map(bd => ({
          date: new Date(bd.date),
          reason: bd.label
        })),
        timezone: availability.timezone,
        bookedSlots: (availability as any).bookedSlots
      } : null
    };
  }
}
