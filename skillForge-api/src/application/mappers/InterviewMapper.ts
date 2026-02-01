import { injectable } from 'inversify';
import { Interview } from '../../domain/entities/Interview';
import { InterviewResponseDTO } from '../dto/interview/ScheduleInterviewDTO';
import { IInterviewMapper } from './interfaces/IInterviewMapper';

@injectable()
export class InterviewMapper implements IInterviewMapper {
    public toResponseDTO(interview: Interview): InterviewResponseDTO {
        return {
            id: interview.id,
            applicationId: interview.applicationId,
            scheduledAt: interview.scheduledAt,
            durationMinutes: interview.durationMinutes,
            status: interview.status,
            meetingLink: interview.meetingLink,
            createdAt: interview.createdAt,
            updatedAt: interview.updatedAt,
        };
    }
}
