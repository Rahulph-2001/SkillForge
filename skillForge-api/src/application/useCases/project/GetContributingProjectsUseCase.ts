import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { Project } from '../../../domain/entities/Project';
import { IGetContributingProjectsUseCase } from './interfaces/IGetContributingProjectsUseCase';

@injectable()
export class GetContributingProjectsUseCase implements IGetContributingProjectsUseCase {
    constructor(
        @inject(TYPES.IProjectRepository) private projectRepository: IProjectRepository
    ) { }

    async execute(userId: string): Promise<Project[]> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        return this.projectRepository.findContributingProjects(userId);
    }
}
