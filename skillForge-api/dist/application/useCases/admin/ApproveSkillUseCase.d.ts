import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IApproveSkillUseCase } from './interfaces/IApproveSkillUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
export declare class ApproveSkillUseCase implements IApproveSkillUseCase {
    private readonly skillRepository;
    private readonly notificationService;
    constructor(skillRepository: ISkillRepository, notificationService: INotificationService);
    execute(skillId: string, _adminId: string): Promise<void>;
}
//# sourceMappingURL=ApproveSkillUseCase.d.ts.map