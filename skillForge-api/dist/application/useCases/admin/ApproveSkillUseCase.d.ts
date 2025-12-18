import { Database } from '../../../infrastructure/database/Database';
export declare class ApproveSkillUseCase {
    private prisma;
    constructor(database: Database);
    execute(skillId: string, _adminId: string): Promise<void>;
}
//# sourceMappingURL=ApproveSkillUseCase.d.ts.map