import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IListPendingSkillsUseCase } from './interfaces/IListPendingSkillsUseCase';
import { ListPendingSkillsResponseDTO } from '../../dto/admin/ListPendingSkillsResponseDTO';
import { IPendingSkillMapper } from '../../mappers/interfaces/IPendingSkillMapper';
import { NotFoundError } from '../../../domain/errors/AppError';

@injectable()
export class ListPendingSkillsUseCase implements IListPendingSkillsUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IPendingSkillMapper) private pendingSkillMapper: IPendingSkillMapper
  ) {}

  async execute(): Promise<ListPendingSkillsResponseDTO> {
    // Get all skills that passed MCQ and are waiting for admin approval
    const skills = await this.skillRepository.findPending();

    const dtos = await Promise.all(skills.map(async (skill) => {
      const provider = await this.userRepository.findById(skill.providerId);
      if (!provider) {
        // Log error or handle gracefully. For strictness, we assume provider exists.
        throw new NotFoundError(`Provider ${skill.providerId} not found for skill ${skill.id}`);
      }
      return this.pendingSkillMapper.toDTO(skill, provider);
    }));

    return dtos;
  }
}
