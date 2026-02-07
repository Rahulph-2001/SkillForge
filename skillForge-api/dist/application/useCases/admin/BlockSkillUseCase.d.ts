import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IBlockSkillUseCase, BlockSkillDTO } from './interfaces/IBlockSkillUseCase';
import { INotificationService } from '../../../domain/services/INotificationService';
export declare class BlockSkillUseCase implements IBlockSkillUseCase {
    private readonly skillRepository;
    private readonly notificationService;
    constructor(skillRepository: ISkillRepository, notificationService: INotificationService);
    execute(data: BlockSkillDTO): Promise<void>;
}
//# sourceMappingURL=BlockSkillUseCase.d.ts.map