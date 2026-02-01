import { IGetInterviewUseCase } from './interfaces/IGetInterviewUseCase';
import { InterviewResponseDTO } from '../../dto/interview/ScheduleInterviewDTO';
import { IInterviewRepository } from '../../../domain/repositories/IInterviewRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IInterviewMapper } from '../../mappers/interfaces/IInterviewMapper';
export declare class GetInterviewUseCase implements IGetInterviewUseCase {
    private interviewRepository;
    private applicationRepository;
    private projectRepository;
    private mapper;
    constructor(interviewRepository: IInterviewRepository, applicationRepository: IProjectApplicationRepository, projectRepository: IProjectRepository, mapper: IInterviewMapper);
    execute(userId: string, applicationId: string): Promise<InterviewResponseDTO[]>;
}
//# sourceMappingURL=GetInterviewUseCase.d.ts.map