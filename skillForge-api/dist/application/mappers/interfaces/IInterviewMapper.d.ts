import { Interview } from '../../../domain/entities/Interview';
import { InterviewResponseDTO } from '../../dto/interview/ScheduleInterviewDTO';
export interface IInterviewMapper {
    toResponseDTO(interview: Interview): InterviewResponseDTO;
}
//# sourceMappingURL=IInterviewMapper.d.ts.map