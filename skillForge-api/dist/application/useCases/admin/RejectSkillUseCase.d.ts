import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IRejectSkillUseCase, RejectSkillDTO } from './interfaces/IRejectSkillUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
export declare class RejectSkillUseCase implements IRejectSkillUseCase {
    private readonly skillRepository;
    private readonly notificationService;
    constructor(skillRepository: ISkillRepository, notificationService: INotificationService);
    execute(data: RejectSkillDTO): Promise<void>;
}
//# sourceMappingURL=RejectSkillUseCase.d.ts.map