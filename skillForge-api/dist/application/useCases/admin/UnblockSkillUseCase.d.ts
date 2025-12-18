import { Database } from '../../../infrastructure/database/Database';
export declare class UnblockSkillUseCase {
    private prisma;
    constructor(database: Database);
    execute(skillId: string, _adminId: string): Promise<void>;
}
//# sourceMappingURL=UnblockSkillUseCase.d.ts.map