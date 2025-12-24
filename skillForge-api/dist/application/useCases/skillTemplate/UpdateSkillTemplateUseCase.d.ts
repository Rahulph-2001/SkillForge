import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
import { UpdateSkillTemplateDTO } from '../../dto/skillTemplate/UpdateSkillTemplateDTO';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export declare class UpdateSkillTemplateUseCase {
    private readonly skillTemplateRepository;
    private readonly userRepository;
    constructor(skillTemplateRepository: ISkillTemplateRepository, userRepository: IUserRepository);
    execute(adminUserId: string, templateId: string, dto: UpdateSkillTemplateDTO): Promise<SkillTemplate>;
}
//# sourceMappingURL=UpdateSkillTemplateUseCase.d.ts.map