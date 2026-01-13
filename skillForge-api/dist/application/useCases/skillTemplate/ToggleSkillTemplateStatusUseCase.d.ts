import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IToggleSkillTemplateStatusUseCase } from './interfaces/IToggleSkillTemplateStatusUseCase';
export declare class ToggleSkillTemplateStatusUseCase implements IToggleSkillTemplateStatusUseCase {
    private readonly skillTemplateRepository;
    private readonly userRepository;
    constructor(skillTemplateRepository: ISkillTemplateRepository, userRepository: IUserRepository);
    execute(adminUserId: string, templateId: string): Promise<SkillTemplate>;
}
//# sourceMappingURL=ToggleSkillTemplateStatusUseCase.d.ts.map