import { Request, Response, NextFunction } from 'express';
import { IListPendingSkillsUseCase } from '../../../application/useCases/admin/interfaces/IListPendingSkillsUseCase';
import { IApproveSkillUseCase } from '../../../application/useCases/admin/interfaces/IApproveSkillUseCase';
import { IRejectSkillUseCase } from '../../../application/useCases/admin/interfaces/IRejectSkillUseCase';
import { IGetAllSkillsUseCase } from '../../../application/useCases/admin/interfaces/IGetAllSkillsUseCase';
import { IBlockSkillUseCase } from '../../../application/useCases/admin/interfaces/IBlockSkillUseCase';
import { IUnblockSkillUseCase } from '../../../application/useCases/admin/interfaces/IUnblockSkillUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class AdminSkillController {
    private listPendingSkillsUseCase;
    private approveSkillUseCase;
    private rejectSkillUseCase;
    private getAllSkillsUseCase;
    private blockSkillUseCase;
    private unblockSkillUseCase;
    private responseBuilder;
    constructor(listPendingSkillsUseCase: IListPendingSkillsUseCase, approveSkillUseCase: IApproveSkillUseCase, rejectSkillUseCase: IRejectSkillUseCase, getAllSkillsUseCase: IGetAllSkillsUseCase, blockSkillUseCase: IBlockSkillUseCase, unblockSkillUseCase: IUnblockSkillUseCase, responseBuilder: IResponseBuilder);
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