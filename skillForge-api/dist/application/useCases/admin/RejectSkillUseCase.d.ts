export interface RejectSkillDTO {
    skillId: string;
    adminId: string;
    reason: string;
}
import { Database } from '../../../infrastructure/database/Database';
export declare class RejectSkillUseCase {
    private prisma;
    constructor(database: Database);
    execute(data: RejectSkillDTO): Promise<void>;
}
//# sourceMappingURL=RejectSkillUseCase.d.ts.map