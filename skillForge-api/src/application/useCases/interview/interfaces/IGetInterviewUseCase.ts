import { InterviewResponseDTO } from '../../../dto/interview/ScheduleInterviewDTO';

export interface IGetInterviewUseCase {
    execute(userId: string, applicationId: string): Promise<InterviewResponseDTO[]>;
}
