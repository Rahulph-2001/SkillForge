import { IGeminiAIService, ApplicantProfile, ProjectDetails } from '../../domain/services/IGeminiAIService';
import { MatchAnalysis } from '../../domain/entities/ProjectApplication';
export declare class GeminiAIService implements IGeminiAIService {
    private readonly genAI;
    private readonly model;
    constructor();
    analyzeApplicantMatch(project: ProjectDetails, applicant: ApplicantProfile, coverLetter: string): Promise<MatchAnalysis>;
    private buildAnalysisPrompt;
    private validateAnalysis;
    private getFallbackAnalysis;
}
//# sourceMappingURL=GeminiAIService.d.ts.map