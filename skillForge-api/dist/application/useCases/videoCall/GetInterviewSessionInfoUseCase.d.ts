import { IGetInterviewSessionInfoUseCase } from './interfaces/IGetInterviewSessionInfoUseCase';
import { SessionInfoDTO } from '../../dto/videoCall/SessionInfoDTO';
import { IInterviewRepository } from '../../../domain/repositories/IInterviewRepository';
import { IProjectApplicationRepository } from '../../../domain/repositories/IProjectApplicationRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
export declare class GetInterviewSessionInfoUseCase implements IGetInterviewSessionInfoUseCase {
    private interviewRepository;
    private applicationRepository;
    private projectRepository;
    private userRepository;
    constructor(interviewRepository: IInterviewRepository, applicationRepository: IProjectApplicationRepository, projectRepository: IProjectRepository, userRepository: IUserRepository);
    execute(interviewId: string): Promise<SessionInfoDTO>;
}
//# sourceMappingURL=GetInterviewSessionInfoUseCase.d.ts.map