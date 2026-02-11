"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSkillController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
const messages_1 = require("../../../config/messages");
let AdminSkillController = class AdminSkillController {
    constructor(listPendingSkillsUseCase, approveSkillUseCase, rejectSkillUseCase, getAllSkillsUseCase, blockSkillUseCase, unblockSkillUseCase, adminListSkillsUseCase, responseBuilder) {
        this.listPendingSkillsUseCase = listPendingSkillsUseCase;
        this.approveSkillUseCase = approveSkillUseCase;
        this.rejectSkillUseCase = rejectSkillUseCase;
        this.getAllSkillsUseCase = getAllSkillsUseCase;
        this.blockSkillUseCase = blockSkillUseCase;
        this.unblockSkillUseCase = unblockSkillUseCase;
        this.adminListSkillsUseCase = adminListSkillsUseCase;
        this.responseBuilder = responseBuilder;
        /**
         * List all pending skills (passed MCQ, waiting for admin approval)
         * GET /api/v1/admin/skills/pending
         */
        this.listPending = async (_req, res, next) => {
            try {
                const skills = await this.listPendingSkillsUseCase.execute();
                const response = this.responseBuilder.success(skills, messages_1.SUCCESS_MESSAGES.SKILL.PENDING_FETCHED(skills.length), HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Approve a skill
         * POST /api/v1/admin/skills/:skillId/approve
         */
        this.approve = async (req, res, next) => {
            try {
                const { skillId } = req.params;
                const adminId = req.user.userId;
                await this.approveSkillUseCase.execute(skillId, adminId);
                const response = this.responseBuilder.success({ skillId, status: 'approved' }, messages_1.SUCCESS_MESSAGES.SKILL.APPROVED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Reject a skill
         * POST /api/v1/admin/skills/:skillId/reject
         */
        this.reject = async (req, res, next) => {
            try {
                const { skillId } = req.params;
                const { reason } = req.body;
                const adminId = req.user.userId;
                // Validate reason
                if (!reason || reason.trim().length === 0) {
                    const errorResponse = this.responseBuilder.error('VALIDATION_ERROR', messages_1.ERROR_MESSAGES.SKILL.REJECTION_REASON_REQUIRED, HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
                    res.status(errorResponse.statusCode).json(errorResponse.body);
                    return;
                }
                await this.rejectSkillUseCase.execute({
                    skillId,
                    adminId,
                    reason,
                });
                const response = this.responseBuilder.success({ skillId, status: 'rejected' }, messages_1.SUCCESS_MESSAGES.SKILL.REJECTED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get all skills (for admin management)
         * GET /api/v1/admin/skills
         */
        this.getAllSkills = async (_req, res, next) => {
            try {
                const skills = await this.getAllSkillsUseCase.execute();
                const response = this.responseBuilder.success(skills, messages_1.SUCCESS_MESSAGES.SKILL.ALL_FETCHED(skills.length), HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * List all skills with pagination and filters (for admin management)
         * GET /api/v1/admin/skills
         */
        this.listSkills = async (req, res, next) => {
            try {
                const adminUserId = req.user.userId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search;
                const status = req.query.status;
                const isBlocked = req.query.isBlocked === 'true' ? true : req.query.isBlocked === 'false' ? false : undefined;
                const result = await this.adminListSkillsUseCase.execute({
                    adminUserId,
                    page,
                    limit,
                    search,
                    status,
                    isBlocked,
                });
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.SKILL.ALL_FETCHED(result.total), HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Block a skill
         * POST /api/v1/admin/skills/:skillId/block
         */
        this.blockSkill = async (req, res, next) => {
            try {
                const { skillId } = req.params;
                const { reason } = req.body;
                const adminId = req.user.userId;
                // Validate reason
                if (!reason || reason.trim().length === 0) {
                    const errorResponse = this.responseBuilder.error('VALIDATION_ERROR', messages_1.ERROR_MESSAGES.SKILL.BLOCK_REASON_REQUIRED, HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
                    res.status(errorResponse.statusCode).json(errorResponse.body);
                    return;
                }
                await this.blockSkillUseCase.execute({
                    skillId,
                    adminId,
                    reason,
                });
                const response = this.responseBuilder.success({ skillId, isBlocked: true }, messages_1.SUCCESS_MESSAGES.SKILL.BLOCKED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Unblock a skill
         * POST /api/v1/admin/skills/:skillId/unblock
         */
        this.unblockSkill = async (req, res, next) => {
            try {
                const { skillId } = req.params;
                const adminId = req.user.userId;
                await this.unblockSkillUseCase.execute(skillId, adminId);
                const response = this.responseBuilder.success({ skillId, isBlocked: false }, messages_1.SUCCESS_MESSAGES.SKILL.UNBLOCKED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.AdminSkillController = AdminSkillController;
exports.AdminSkillController = AdminSkillController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IListPendingSkillsUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IApproveSkillUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IRejectSkillUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IGetAllSkillsUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IBlockSkillUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.IUnblockSkillUseCase)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.IAdminListSkillsUseCase)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], AdminSkillController);
//# sourceMappingURL=AdminSkillController.js.map