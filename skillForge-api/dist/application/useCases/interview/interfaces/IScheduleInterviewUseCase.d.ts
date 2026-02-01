import { ScheduleInterviewDTO, InterviewResponseDTO } from '../../../dto/interview/ScheduleInterviewDTO';
export interface IScheduleInterviewUseCase {
    execute(userId: string, data: ScheduleInterviewDTO): Promise<InterviewResponseDTO>;
}
//# sourceMappingURL=IScheduleInterviewUseCase.d.ts.map