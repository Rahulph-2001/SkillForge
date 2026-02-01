import { SessionInfoDTO } from '../../../dto/videoCall/SessionInfoDTO';

export interface IGetInterviewSessionInfoUseCase {
    execute(interviewId: string): Promise<SessionInfoDTO>;
}
