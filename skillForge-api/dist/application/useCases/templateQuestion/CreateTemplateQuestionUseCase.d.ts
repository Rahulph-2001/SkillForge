import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';
import { CreateTemplateQuestionDTO } from '../../dto/templateQuestion/CreateTemplateQuestionDTO';
export declare class CreateTemplateQuestionUseCase {
    private readonly templateQuestionRepository;
    private readonly userRepository;
    constructor(templateQuestionRepository: ITemplateQuestionRepository, userRepository: IUserRepository);
    execute(adminUserId: string, dto: CreateTemplateQuestionDTO): Promise<TemplateQuestion>;
}
//# sourceMappingURL=CreateTemplateQuestionUseCase.d.ts.map