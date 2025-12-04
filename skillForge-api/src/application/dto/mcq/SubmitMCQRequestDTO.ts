export interface SubmitMCQRequestDTO {
  skillId: string;
  userId: string;
  questionIds: string[];
  answers: number[];
  timeTaken?: number;
}
