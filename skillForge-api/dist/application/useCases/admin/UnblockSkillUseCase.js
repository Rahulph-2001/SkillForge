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
exports.UnblockSkillUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Database_1 = require("../../../infrastructure/database/Database");
let UnblockSkillUseCase = class UnblockSkillUseCase {
    constructor(database) {
        this.prisma = database.getClient();
    }
    async execute(skillId, _adminId) {
        // Verify skill exists
        const skill = await this.prisma.skill.findUnique({
            where: { id: skillId },
        });
        if (!skill) {
            throw new Error('Skill not found');
        }
        if (!skill.isBlocked) {
            throw new Error('Skill is not blocked');
        }
        // Unblock the skill
        await this.prisma.skill.update({
            where: { id: skillId },
            data: {
                isBlocked: false,
                isAdminBlocked: false,
                blockedReason: null,
                blockedAt: null,
                updatedAt: new Date(),
            },
        });
    }
};
exports.UnblockSkillUseCase = UnblockSkillUseCase;
exports.UnblockSkillUseCase = UnblockSkillUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], UnblockSkillUseCase);
//# sourceMappingURL=UnblockSkillUseCase.js.map