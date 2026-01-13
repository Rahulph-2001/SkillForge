import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IBlockSkillUseCase, BlockSkillDTO } from './interfaces/IBlockSkillUseCase';
export declare class BlockSkillUseCase implements IBlockSkillUseCase {
    private readonly skillRepository;
    constructor(skillRepository: ISkillRepository);
    execute(data: BlockSkillDTO): Promise<void>;
}
//# sourceMappingURL=BlockSkillUseCase.d.ts.map