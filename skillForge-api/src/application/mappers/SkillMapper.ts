import { injectable } from 'inversify';
import { Skill } from '../../domain/entities/Skill';
import { SkillResponseDTO } from '../dto/skill/SkillResponseDTO';
import { ISkillMapper } from './interfaces/ISkillMapper';

@injectable()
export class SkillMapper implements ISkillMapper {
  public toResponseDTO(skill: Skill): SkillResponseDTO {
    return {
      id: skill.id,
      providerId: skill.providerId,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      level: skill.level,
      durationHours: skill.durationHours,
      creditsPerHour: skill.creditsPerHour,
      tags: skill.tags,
      imageUrl: skill.imageUrl,
      templateId: skill.templateId,
      status: skill.status,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt
    };
  }
}
