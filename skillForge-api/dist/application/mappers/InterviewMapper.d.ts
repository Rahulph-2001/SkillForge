import { Interview } from '../../domain/entities/Interview';
import { InterviewResponseDTO } from '../dto/interview/ScheduleInterviewDTO';
import { IInterviewMapper } from './interfaces/IInterviewMapper';
export declare class InterviewMapper implements IInterviewMapper {
    toResponseDTO(interview: Interview): InterviewResponseDTO;
}
//# sourceMappingURL=InterviewMapper.d.ts.map