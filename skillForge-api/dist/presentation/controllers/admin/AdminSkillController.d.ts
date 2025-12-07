import { Request, Response, NextFunction } from 'express';
import { IListPendingSkillsUseCase } from '../../../application/useCases/admin/interfaces/IListPendingSkillsUseCase';
import { ApproveSkillUseCase } from '../../../application/useCases/admin/ApproveSkillUseCase';
import { RejectSkillUseCase } from '../../../application/useCases/admin/RejectSkillUseCase';
import { GetAllSkillsUseCase } from '../../../application/useCases/admin/GetAllSkillsUseCase';
import { BlockSkillUseCase } from '../../../application/useCases/admin/BlockSkillUseCase';
import { UnblockSkillUseCase } from '../../../application/useCases/admin/UnblockSkillUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class AdminSkillController {
    private listPendingSkillsUseCase;
    private approveSkillUseCase;
    private rejectSkillUseCase;
    private getAllSkillsUseCase;
    private blockSkillUseCase;
    private unblockSkillUseCase;
    private responseBuilder;
    constructor(listPendingSkillsUseCase: IListPendingSkillsUseCase, approveSkillUseCase: ApproveSkillUseCase, rejectSkillUseCase: RejectSkillUseCase, getAllSkillsUseCase: GetAllSkillsUseCase, blockSkillUseCase: BlockSkillUseCase, unblockSkillUseCase: UnblockSkillUseCase, responseBuilder: IResponseBuilder);
    /**
     * List all pending skills (passed MCQ, waiting for admin approval)
     * GET /api/v1/admin/skills/pending
     */
    listPending: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Approve a skill
     * POST /api/v1/admin/skills/:skillId/approve
     */
    approve: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Reject a skill
     * POST /api/v1/admin/skills/:skillId/reject
     */
    reject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get all skills (for admin management)
     * GET /api/v1/admin/skills
     */
    getAllSkills: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Block a skill
     * POST /api/v1/admin/skills/:skillId/block
     */
    blockSkill: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Unblock a skill
     * POST /api/v1/admin/skills/:skillId/unblock
     */
    unblockSkill: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AdminSkillController.d.ts.map