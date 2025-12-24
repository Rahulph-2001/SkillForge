import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
export declare class MCQImportJobProcessor {
    private jobRepository;
    private questionRepository;
    private storageService;
    private readonly validLevels;
    private readonly validAnswers;
    constructor(jobRepository: IMCQImportJobRepository, questionRepository: ITemplateQuestionRepository, storageService: IStorageService);
    execute(jobId: string): Promise<void>;
    private parseExcel;
    private parseCSV;
    private validateAndMapRow;
    private createErrorCSV;
}
//# sourceMappingURL=MCQImportJobProcessor.d.ts.map