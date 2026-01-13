import { TemplateQuestion } from '../../../../domain/entities/TemplateQuestion';
export interface IListTemplateQuestionsUseCase {
    execute(adminUserId: string, templateId: string, level?: string): Promise<TemplateQuestion[]>;
}
//# sourceMappingURL=IListTemplateQuestionsUseCase.d.ts.map