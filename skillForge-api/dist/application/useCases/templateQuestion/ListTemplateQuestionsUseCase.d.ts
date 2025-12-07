import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';
export declare class ListTemplateQuestionsUseCase {
    private readonly templateQuestionRepository;
    private readonly userRepository;
    constructor(templateQuestionRepository: ITemplateQuestionRepository, userRepository: IUserRepository);
    execute(adminUserId: string, templateId: string, level?: string): Promise<TemplateQuestion[]>;
}
//# sourceMappingURL=ListTemplateQuestionsUseCase.d.ts.map