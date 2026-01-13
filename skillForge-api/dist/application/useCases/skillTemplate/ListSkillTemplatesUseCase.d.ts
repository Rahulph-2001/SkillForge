import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IListSkillTemplatesUseCase } from './interfaces/IListSkillTemplatesUseCase';
export declare class ListSkillTemplatesUseCase implements IListSkillTemplatesUseCase {
    private readonly skillTemplateRepository;
    private readonly userRepository;
    constructor(skillTemplateRepository: ISkillTemplateRepository, userRepository: IUserRepository);
    execute(adminUserId: string): Promise<SkillTemplate[]>;
    executePublic(): Promise<SkillTemplate[]>;
}
//# sourceMappingURL=ListSkillTemplatesUseCase.d.ts.map