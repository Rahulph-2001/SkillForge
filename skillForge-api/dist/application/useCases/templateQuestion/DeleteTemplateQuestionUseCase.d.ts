import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export declare class DeleteTemplateQuestionUseCase {
    private readonly templateQuestionRepository;
    private readonly userRepository;
    constructor(templateQuestionRepository: ITemplateQuestionRepository, userRepository: IUserRepository);
    execute(adminUserId: string, questionId: string): Promise<void>;
}
//# sourceMappingURL=DeleteTemplateQuestionUseCase.d.ts.map