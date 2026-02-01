import { Interview } from '../entities/Interview';
export interface IInterviewRepository {
    create(interview: Interview): Promise<Interview>;
    findById(id: string): Promise<Interview | null>;
    findByApplicationId(applicationId: string): Promise<Interview[]>;
    update(interview: Interview): Promise<Interview>;
    findExpiredInterviews(): Promise<Interview[]>;
}
//# sourceMappingURL=IInterviewRepository.d.ts.map