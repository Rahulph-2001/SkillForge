import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { ProjectApplication } from '../../../domain/entities/ProjectApplication';

@injectable()
export class GetReceivedApplicationsUseCase {
    constructor(
        @inject(TYPES.IProjectApplicationRepository) private projectApplicationRepository: IProjectApplicationRepository
    ) { }

    async execute(userId: string): Promise<ProjectApplication[]> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        return this.projectApplicationRepository.findReceivedApplications(userId);
    }
}
