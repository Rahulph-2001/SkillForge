import { type UpdateTemplateQuestionDTO } from '../../../dto/templateQuestion/UpdateTemplateQuestionDTO';
import { type TemplateQuestion } from '../../../../domain/entities/TemplateQuestion';

export interface IUpdateTemplateQuestionUseCase {
  execute(adminUserId: string, questionId: string, dto: UpdateTemplateQuestionDTO): Promise<TemplateQuestion>;
}

