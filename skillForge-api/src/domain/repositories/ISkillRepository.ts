import { Skill } from '../entities/Skill';

export interface ISkillRepository {
  create(skill: Skill): Promise<Skill>;
  findByProviderId(providerId: string): Promise<Skill[]>;
  findById(id: string): Promise<Skill | null>;
  findAll(filters?: { category?: string; status?: string }): Promise<Skill[]>;
}