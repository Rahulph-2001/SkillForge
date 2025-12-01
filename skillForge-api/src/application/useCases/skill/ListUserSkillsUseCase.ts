import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';

@injectable()
export class ListUserSkillsUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository
  ) {}

  async execute(userId: string): Promise<Skill[]> {
    return await this.skillRepository.findByProviderId(userId);
  }
}