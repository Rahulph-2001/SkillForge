import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export declare class DeleteSkillTemplateUseCase {
    private readonly skillTemplateRepository;
    private readonly userRepository;
    constructor(skillTemplateRepository: ISkillTemplateRepository, userRepository: IUserRepository);
    execute(adminUserId: string, templateId: string): Promise<void>;
}
//# sourceMappingURL=DeleteSkillTemplateUseCase.d.ts.map