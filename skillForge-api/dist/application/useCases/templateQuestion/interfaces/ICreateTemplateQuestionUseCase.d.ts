import { CreateTemplateQuestionDTO } from '../../../dto/templateQuestion/CreateTemplateQuestionDTO';
import { TemplateQuestion } from '../../../../domain/entities/TemplateQuestion';
export interface ICreateTemplateQuestionUseCase {
    execute(adminUserId: string, dto: CreateTemplateQuestionDTO): Promise<TemplateQuestion>;
}
//# sourceMappingURL=ICreateTemplateQuestionUseCase.d.ts.map