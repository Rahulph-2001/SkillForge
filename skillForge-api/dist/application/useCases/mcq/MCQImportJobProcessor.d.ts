import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { IS3Service } from '../../../domain/services/IS3Service';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
export declare class MCQImportJobProcessor {
    private jobRepository;
    private questionRepository;
    private s3Service;
    private readonly validLevels;
    private readonly validAnswers;
    constructor(jobRepository: IMCQImportJobRepository, questionRepository: ITemplateQuestionRepository, s3Service: IS3Service);
    execute(jobId: string): Promise<void>;
    private parseExcel;
    private parseCSV;
    private validateAndMapRow;
    private createErrorCSV;
}
//# sourceMappingURL=MCQImportJobProcessor.d.ts.map