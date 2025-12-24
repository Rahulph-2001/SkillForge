import { IListMCQImportJobsUseCase } from './interfaces/IListMCQImportJobsUseCase';
import { ListMCQImportJobsResponseDTO } from '../../dto/mcq/MCQImportJobDTO';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
export declare class ListMCQImportJobsUseCase implements IListMCQImportJobsUseCase {
    private userRepository;
    private jobRepository;
    private storageService;
    constructor(userRepository: IUserRepository, jobRepository: IMCQImportJobRepository, storageService: IStorageService);
    execute(templateId: string, adminId: string): Promise<ListMCQImportJobsResponseDTO>;
}
//# sourceMappingURL=ListMCQImportJobsUseCase.d.ts.map