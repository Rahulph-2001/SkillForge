import { type Interview } from '../../../domain/entities/Interview';
import { type InterviewResponseDTO } from '../../dto/interview/ScheduleInterviewDTO';

export interface IInterviewMapper {
    toResponseDTO(interview: Interview): InterviewResponseDTO;
}
