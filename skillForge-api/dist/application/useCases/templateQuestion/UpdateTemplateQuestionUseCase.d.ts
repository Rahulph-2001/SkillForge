import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { TemplateQuestion } from '../../../domain/entities/TemplateQuestion';
import { UpdateTemplateQuestionDTO } from '../../dto/templateQuestion/UpdateTemplateQuestionDTO';
export declare class UpdateTemplateQuestionUseCase {
    private readonly templateQuestionRepository;
    private readonly userRepository;
    constructor(templateQuestionRepository: ITemplateQuestionRepository, userRepository: IUserRepository);
    execute(adminUserId: string, questionId: string, dto: UpdateTemplateQuestionDTO): Promise<TemplateQuestion>;
}
//# sourceMappingURL=UpdateTemplateQuestionUseCase.d.ts.map