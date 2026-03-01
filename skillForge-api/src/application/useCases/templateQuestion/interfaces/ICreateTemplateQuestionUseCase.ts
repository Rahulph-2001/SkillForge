import { type CreateTemplateQuestionDTO } from '../../../dto/templateQuestion/CreateTemplateQuestionDTO';
import { type TemplateQuestion } from '../../../../domain/entities/TemplateQuestion';

export interface ICreateTemplateQuestionUseCase {
  execute(adminUserId: string, dto: CreateTemplateQuestionDTO): Promise<TemplateQuestion>;
}

