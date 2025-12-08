import { injectable } from 'inversify';
import { Skill } from '../../domain/entities/Skill';
import { User } from '../../domain/entities/User';
import { SkillDetailsDTO } from '../dto/skill/SkillDetailsResponseDTO';
import { ISkillDetailsMapper } from './interfaces/ISkillDetailsMapper';

@injectable()
export class SkillDetailsMapper implements ISkillDetailsMapper {
  public toDTO(skill: Skill, provider: User, providerStats: { rating: number; reviewCount: number }, availability?: any): SkillDetailsDTO {
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
      rating: skill.rating,
      totalSessions: skill.totalSessions,
      provider: {
        id: provider.id,
        name: provider.name,
        email: provider.email.value,
        rating: providerStats.rating,
        reviewCount: providerStats.reviewCount,
      },
      availability: availability ? {
        weeklySchedule: availability.weeklySchedule,
        blockedDates: availability.blockedDates,
        timezone: availability.timezone
      } : null
    };
  }
}
