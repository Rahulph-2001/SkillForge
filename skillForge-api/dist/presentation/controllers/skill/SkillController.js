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
exports.SkillController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const messages_1 = require("../../../config/messages");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
let SkillController = class SkillController {
    constructor(createSkillUseCase, listUserSkillsUseCase, updateSkillUseCase, toggleSkillBlockUseCase, responseBuilder) {
        this.createSkillUseCase = createSkillUseCase;
        this.listUserSkillsUseCase = listUserSkillsUseCase;
        this.updateSkillUseCase = updateSkillUseCase;
        this.toggleSkillBlockUseCase = toggleSkillBlockUseCase;
        this.responseBuilder = responseBuilder;
        this.create = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const file = req.file;
                const skillDTO = req.body;
                const skill = await this.createSkillUseCase.execute(userId, skillDTO, file ? {
                    buffer: file.buffer,
                    originalname: file.originalname,
                    mimetype: file.mimetype
                } : undefined);
                const response = this.responseBuilder.success(skill, messages_1.SUCCESS_MESSAGES.SKILL.CREATED, HttpStatusCode_1.HttpStatusCode.CREATED);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.listMySkills = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const skills = await this.listUserSkillsUseCase.execute(userId);
                const response = this.responseBuilder.success(skills, messages_1.SUCCESS_MESSAGES.SKILL.FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.update = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { id } = req.params;
                const updates = req.body;
                const file = req.file;
                // Parse numeric fields from multipart/form-data (which come as strings)
                if (updates.durationHours)
                    updates.durationHours = Number(updates.durationHours);
                if (updates.creditsPerHour)
                    updates.creditsPerHour = Number(updates.creditsPerHour);
                // Parse tags if it comes as a JSON string
                if (updates.tags && typeof updates.tags === 'string') {
                    try {
                        updates.tags = JSON.parse(updates.tags);
                    }
                    catch (e) {
                        // Invalid JSON - tags will remain as string, which will be validated by use case
                    }
                }
                if (file) {
                    // If file is present, we need to upload it.
                    // Since UpdateSkillUseCase expects just DTO, we might need to handle upload here 
                    // OR update UpdateSkillUseCase to handle file.
                    // Looking at CreateSkillUseCase, it handles the file. 
                    // However, UpdateSkillUseCase signature is (skillId, providerId, updates).
                    // I will check if I can modify UpdateSkillUseCase or if I should upload here.
                    // The cleanest way is to pass the file to UseCase like in Create.
                    // But I'll stick to the plan: Modify Controller to upload (if I have S3Service) OR modify UseCase.
                    // Looking at CreateSkillUseCase again (step 116), it injects S3Service.
                    // UpdateSkillUseCase (step 92) does NOT inject S3Service.
                    // So I should modify UpdateSkillUseCase to accept file just like CreateSkillUseCase.
                }
                // WAIT, I should modify UpdateSkillUseCase to consistency.
                // But let's check if I can just pass it.
                const skill = await this.updateSkillUseCase.execute(id, userId, updates, file ? {
                    buffer: file.buffer,
                    originalname: file.originalname,
                    mimetype: file.mimetype
                } : undefined);
                const response = this.responseBuilder.success(skill, messages_1.SUCCESS_MESSAGES.SKILL.UPDATED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.toggleBlock = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { id } = req.params;
                const skill = await this.toggleSkillBlockUseCase.execute(id, userId);
                const response = this.responseBuilder.success(skill, skill.isBlocked ? 'Skill blocked successfully' : 'Skill unblocked successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.SkillController = SkillController;
exports.SkillController = SkillController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICreateSkillUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IListUserSkillsUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUpdateSkillUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IToggleSkillBlockUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], SkillController);
//# sourceMappingURL=SkillController.js.map