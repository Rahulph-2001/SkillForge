export interface MCQQuestionDTO {
  id: string;
  questionText: string;
  options: string[];
  // No correctAnswer or explanation
}

export interface StartMCQResponseDTO {
  skillId: string;
  templateId: string;
  level: string;
  questions: MCQQuestionDTO[];
  totalQuestions: number;
  passingScore: number;
}
