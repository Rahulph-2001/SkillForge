import { injectable } from 'inversify';
import { Skill } from '../../domain/entities/Skill';
import { User } from '../../domain/entities/User';
import { BrowseSkillDTO } from '../dto/skill/BrowseSkillsResponseDTO';
import { IBrowseSkillMapper } from './interfaces/IBrowseSkillMapper';

@injectable()
export class BrowseSkillMapper implements IBrowseSkillMapper {
  public toDTO(skill: Skill, provider: User): BrowseSkillDTO {
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
      }
    };
  }
}
