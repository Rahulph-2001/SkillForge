import { Project } from '../../../../domain/entities/Project';

export interface IGetMyProjectsUseCase {
    execute(userId: string): Promise<Project[]>;
}
