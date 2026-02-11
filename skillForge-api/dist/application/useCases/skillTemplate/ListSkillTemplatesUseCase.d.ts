import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IListSkillTemplatesUseCase, SkillTemplateListResult } from './interfaces/IListSkillTemplatesUseCase';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
export declare class ListSkillTemplatesUseCase implements IListSkillTemplatesUseCase {
    private readonly skillTemplateRepository;
    private readonly userRepository;
    private readonly paginationService;
    constructor(skillTemplateRepository: ISkillTemplateRepository, userRepository: IUserRepository, paginationService: IPaginationService);
    execute(adminUserId: string, page?: number, limit?: number, search?: string, category?: string, status?: string): Promise<SkillTemplateListResult>;
    executePublic(): Promise<SkillTemplate[]>;
}
//# sourceMappingURL=ListSkillTemplatesUseCase.d.ts.map