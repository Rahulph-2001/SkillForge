import { UpdateTemplateQuestionDTO } from '../../../dto/templateQuestion/UpdateTemplateQuestionDTO';
import { TemplateQuestion } from '../../../../domain/entities/TemplateQuestion';
export interface IUpdateTemplateQuestionUseCase {
    execute(adminUserId: string, questionId: string, dto: UpdateTemplateQuestionDTO): Promise<TemplateQuestion>;
}
//# sourceMappingURL=IUpdateTemplateQuestionUseCase.d.ts.map