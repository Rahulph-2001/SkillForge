export interface MCQQuestionDTO {
    id: string;
    questionText: string;
    options: string[];
}
export interface StartMCQResponseDTO {
    skillId: string;
    templateId: string;
    level: string;
    questions: MCQQuestionDTO[];
    totalQuestions: number;
    passingScore: number;
}
//# sourceMappingURL=StartMCQResponseDTO.d.ts.map