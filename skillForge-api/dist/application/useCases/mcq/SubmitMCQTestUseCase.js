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
exports.SubmitMCQTestUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const Notification_1 = require("../../../domain/entities/Notification");
let SubmitMCQTestUseCase = class SubmitMCQTestUseCase {
    constructor(mcqRepository, skillRepository, adminNotificationService) {
        this.mcqRepository = mcqRepository;
        this.skillRepository = skillRepository;
        this.adminNotificationService = adminNotificationService;
    }
    async execute(request) {
        const { skillId, userId, questionIds, answers, timeTaken } = request;
        // Get skill details
        const skill = await this.skillRepository.findById(skillId);
        if (!skill) {
            throw new AppError_1.NotFoundError('Skill not found');
        }
        // Verify skill belongs to user
        if (skill.providerId !== userId) {
            throw new AppError_1.ForbiddenError('Unauthorized: This skill does not belong to you');
        }
        // Validate question IDs are provided
        if (!questionIds || questionIds.length === 0) {
            throw new AppError_1.ValidationError('Question IDs are required');
        }
        // Get the EXACT questions that were asked (by their IDs)
        const questions = await this.mcqRepository.getQuestionsByIds(questionIds);
        if (questions.length === 0) {
            throw new AppError_1.NotFoundError('No questions found');
        }
        // Validate answers length matches questions
        if (answers.length !== questions.length) {
            throw new AppError_1.ValidationError(`Invalid number of answers. Expected ${questions.length}, got ${answers.length}`);
        }
        // Grade the test
        let correctAnswers = 0;
        const details = questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            if (isCorrect) {
                correctAnswers++;
            }
            return {
                questionId: question.id,
                userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation,
            };
        });
        // Calculate score percentage
        const score = Math.round((correctAnswers / questions.length) * 100);
        const passingScore = skill.mcqPassingScore || 70;
        const passed = score >= passingScore;
        let attemptId = '';
        // Only save attempt and update skill if passed
        if (passed) {
            // Create attempt record for passed attempts only
            const attempt = await this.mcqRepository.createAttempt({
                skillId,
                userId,
                questionsAsked: questions.map(q => q.id),
                userAnswers: answers,
                score,
                passed,
                timeTaken,
            });
            attemptId = attempt.id;
            // Update skill to "in-review" status (waiting for admin approval)
            skill.passMCQ(score);
            await this.skillRepository.update(skill);
            // Notify admins that a skill has passed verification and is pending approval
            await this.adminNotificationService.notifyAllAdmins({
                type: Notification_1.NotificationType.NEW_SKILL_PENDING,
                title: 'Skill Passed Verification',
                message: `Skill "${skill.title}" has passed MCQ verification and is waiting for approval.`,
                data: { skillId: skill.id, providerId: skill.providerId, score }
            });
        }
        return {
            attemptId,
            score,
            passed,
            correctAnswers,
            totalQuestions: questions.length,
            passingScore,
            details,
        };
    }
};
exports.SubmitMCQTestUseCase = SubmitMCQTestUseCase;
exports.SubmitMCQTestUseCase = SubmitMCQTestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IMCQRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISkillRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IAdminNotificationService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], SubmitMCQTestUseCase);
//# sourceMappingURL=SubmitMCQTestUseCase.js.map