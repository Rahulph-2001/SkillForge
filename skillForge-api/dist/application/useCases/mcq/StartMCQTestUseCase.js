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
exports.StartMCQTestUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let StartMCQTestUseCase = class StartMCQTestUseCase {
    constructor(mcqRepository, skillRepository) {
        this.mcqRepository = mcqRepository;
        this.skillRepository = skillRepository;
    }
    async execute(request) {
        const { skillId, userId } = request;
        // Get skill details
        const skill = await this.skillRepository.findById(skillId);
        if (!skill) {
            throw new Error('Skill not found');
        }
        // Verify skill belongs to user
        if (skill.providerId !== userId) {
            throw new Error('Unauthorized: This skill does not belong to you');
        }
        // Check if skill is in pending status
        if (skill.status !== 'pending') {
            throw new Error('Skill is not in pending status');
        }
        // Check if template exists
        if (!skill.templateId) {
            throw new Error('Skill template not found');
        }
        // Get random questions for the skill's level from template
        const questionsNeeded = skill.mcqTotalQuestions || 7;
        const questions = await this.mcqRepository.getQuestionsByTemplate(skill.templateId, skill.level, questionsNeeded);
        if (questions.length === 0) {
            throw new Error(`No questions available for level: ${skill.level}`);
        }
        // Remove correct answers from questions sent to frontend
        const questionsWithoutAnswers = questions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
        }));
        return {
            skillId: skill.id,
            templateId: skill.templateId,
            level: skill.level,
            questions: questionsWithoutAnswers,
            totalQuestions: questions.length,
            passingScore: skill.mcqPassingScore || 70,
        };
    }
};
exports.StartMCQTestUseCase = StartMCQTestUseCase;
exports.StartMCQTestUseCase = StartMCQTestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IMCQRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __metadata("design:paramtypes", [Object, Object])
], StartMCQTestUseCase);
//# sourceMappingURL=StartMCQTestUseCase.js.map