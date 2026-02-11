import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetSkillTemplateByIdUseCase } from './interfaces/IGetSkillTemplateByIdUseCase';
export declare class GetSkillTemplateByIdUseCase implements IGetSkillTemplateByIdUseCase {
    private readonly skillTemplateRepository;
    private readonly userRepository;
    constructor(skillTemplateRepository: ISkillTemplateRepository, userRepository: IUserRepository);
    execute(adminUserId: string, templateId: string): Promise<SkillTemplate>;
}
//# sourceMappingURL=GetSkillTemplateByIdUseCase.d.ts.map