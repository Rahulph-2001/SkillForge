import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { IInterviewRepository } from '../../../domain/repositories/IInterviewRepository';
import { Interview } from '../../../domain/entities/Interview';
export declare class InterviewRepository extends BaseRepository<Interview> implements IInterviewRepository {
    constructor(db: Database);
    create(interview: Interview): Promise<Interview>;
    findById(id: string): Promise<Interview | null>;
    findByApplicationId(applicationId: string): Promise<Interview[]>;
    update(interview: Interview): Promise<Interview>;
    findExpiredInterviews(): Promise<Interview[]>;
    private toDomain;
}
//# sourceMappingURL=InterviewRepository.d.ts.map