import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
import { CreateSkillTemplateDTO } from '../../dto/skillTemplate/CreateSkillTemplateDTO';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICreateSkillTemplateUseCase } from './interfaces/ICreateSkillTemplateUseCase';
export declare class CreateSkillTemplateUseCase implements ICreateSkillTemplateUseCase {
    private readonly skillTemplateRepository;
    private readonly userRepository;
    constructor(skillTemplateRepository: ISkillTemplateRepository, userRepository: IUserRepository);
    execute(adminUserId: string, dto: CreateSkillTemplateDTO): Promise<SkillTemplate>;
}
//# sourceMappingURL=CreateSkillTemplateUseCase.d.ts.map