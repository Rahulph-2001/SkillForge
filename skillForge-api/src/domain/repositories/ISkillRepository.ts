import { Skill } from '../entities/Skill';
import { BrowseSkillsRequestDTO } from '../../application/dto/skill/BrowseSkillsRequestDTO';

export interface ISkillRepository {
  create(skill: Skill): Promise<Skill>;
  findByProviderId(providerId: string): Promise<Skill[]>;
  findById(id: string): Promise<Skill | null>;
  findAll(filters?: { category?: string; status?: string }): Promise<Skill[]>;
  findPending(): Promise<Skill[]>;
  browse(filters: BrowseSkillsRequestDTO): Promise<{ skills: Skill[]; total: number }>;
  update(skill: Skill): Promise<Skill>;
}