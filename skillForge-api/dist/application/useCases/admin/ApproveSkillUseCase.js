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
exports.ApproveSkillUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Database_1 = require("../../../infrastructure/database/Database");
let ApproveSkillUseCase = class ApproveSkillUseCase {
    constructor(database) {
        this.prisma = database.getClient();
    }
    async execute(skillId, _adminId) {
        // Verify skill exists and is in review
        const skill = await this.prisma.skill.findUnique({
            where: { id: skillId },
        });
        if (!skill) {
            throw new Error('Skill not found');
        }
        if (skill.status !== 'in-review') {
            throw new Error('Skill is not in review status');
        }
        // Allow admin to approve even if verification is not passed (manual override)
        // But we should log it or ensure it sets verificationStatus to passed
        // Update skill status to approved AND ensure verificationStatus is passed
        await this.prisma.skill.update({
            where: { id: skillId },
            data: {
                status: 'approved',
                verificationStatus: 'passed', // Ensure it shows in browse skills
                updatedAt: new Date(),
            },
        });
    }
};
exports.ApproveSkillUseCase = ApproveSkillUseCase;
exports.ApproveSkillUseCase = ApproveSkillUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], ApproveSkillUseCase);
//# sourceMappingURL=ApproveSkillUseCase.js.map