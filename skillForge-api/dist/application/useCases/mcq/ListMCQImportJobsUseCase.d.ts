import { IListMCQImportJobsUseCase } from './interfaces/IListMCQImportJobsUseCase';
import { ListMCQImportJobsResponseDTO } from '../../dto/mcq/MCQImportJobDTO';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IS3Service } from '../../../domain/services/IS3Service';
export declare class ListMCQImportJobsUseCase implements IListMCQImportJobsUseCase {
    private userRepository;
    private jobRepository;
    private s3Service;
    constructor(userRepository: IUserRepository, jobRepository: IMCQImportJobRepository, s3Service: IS3Service);
    execute(templateId: string, adminId: string): Promise<ListMCQImportJobsResponseDTO>;
}
//# sourceMappingURL=ListMCQImportJobsUseCase.d.ts.map