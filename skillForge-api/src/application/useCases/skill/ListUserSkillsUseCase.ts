import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IListUserSkillsUseCase } from './interfaces/IListUserSkillsUseCase';
import { SkillResponseDTO } from '../../dto/skill/SkillResponseDTO';
import { ISkillMapper } from '../../mappers/interfaces/ISkillMapper';

@injectable()
export class ListUserSkillsUseCase implements IListUserSkillsUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
    @inject(TYPES.ISkillMapper) private skillMapper: ISkillMapper
  ) {}

  async execute(userId: string): Promise<SkillResponseDTO[]> {
    const skills = await this.skillRepository.findByProviderId(userId);
    return skills.map(skill => this.skillMapper.toResponseDTO(skill));
  }
}