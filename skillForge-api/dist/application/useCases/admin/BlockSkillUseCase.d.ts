import { Database } from '../../../infrastructure/database/Database';
export interface BlockSkillDTO {
    skillId: string;
    adminId: string;
    reason: string;
}
export declare class BlockSkillUseCase {
    private prisma;
    constructor(database: Database);
    execute(data: BlockSkillDTO): Promise<void>;
}
//# sourceMappingURL=BlockSkillUseCase.d.ts.map