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
exports.MCQRepository = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const types_1 = require("../../di/types");
let MCQRepository = class MCQRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getQuestionsByTemplate(templateId, level, limit) {
        // Fetch all available questions for the template and level
        const allQuestions = await this.prisma.templateQuestion.findMany({
            where: {
                templateId,
                level,
                isActive: true,
            },
        });
        // If we have fewer questions than requested, return all
        if (allQuestions.length <= limit) {
            return allQuestions.map(this.toDomainQuestion);
        }
        // Randomly shuffle and select 'limit' number of questions
        const shuffled = this.shuffleArray([...allQuestions]);
        const selectedQuestions = shuffled.slice(0, limit);
        return selectedQuestions.map(this.toDomainQuestion);
    }
    // Fisher-Yates shuffle algorithm for random question selection
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    async getQuestionById(id) {
        const question = await this.prisma.templateQuestion.findUnique({
            where: { id },
        });
        return question ? this.toDomainQuestion(question) : null;
    }
    async getQuestionsByIds(ids) {
        const questions = await this.prisma.templateQuestion.findMany({
            where: {
                id: { in: ids },
                isActive: true,
            },
        });
        // Maintain the order of the input IDs
        const orderedQuestions = ids
            .map(id => questions.find(q => q.id === id))
            .filter((q) => q !== undefined);
        return orderedQuestions.map(this.toDomainQuestion);
    }
    async createAttempt(data) {
        const attempt = await this.prisma.skillVerificationAttempt.create({
            data: {
                skillId: data.skillId,
                userId: data.userId,
                questionsAsked: data.questionsAsked,
                userAnswers: data.userAnswers,
                score: data.score,
                passed: data.passed,
                timeTaken: data.timeTaken,
            },
        });
        return this.toDomainAttempt(attempt);
    }
    async getAttemptsBySkill(skillId) {
        const attempts = await this.prisma.skillVerificationAttempt.findMany({
            where: { skillId },
            orderBy: { attemptedAt: 'desc' },
        });
        return attempts.map(this.toDomainAttempt);
    }
    async getAttemptsByUser(userId) {
        const attempts = await this.prisma.skillVerificationAttempt.findMany({
            where: { userId },
            orderBy: { attemptedAt: 'desc' },
        });
        return attempts.map(this.toDomainAttempt);
    }
    async getLatestAttempt(skillId, userId) {
        const attempt = await this.prisma.skillVerificationAttempt.findFirst({
            where: {
                skillId,
                userId,
            },
            orderBy: { attemptedAt: 'desc' },
        });
        return attempt ? this.toDomainAttempt(attempt) : null;
    }
    toDomainQuestion(question) {
        return {
            id: question.id,
            templateId: question.templateId,
            level: question.level,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            isActive: question.isActive,
        };
    }
    toDomainAttempt(attempt) {
        return {
            id: attempt.id,
            skillId: attempt.skillId,
            userId: attempt.userId,
            questionsAsked: attempt.questionsAsked,
            userAnswers: attempt.userAnswers,
            score: attempt.score,
            passed: attempt.passed,
            timeTaken: attempt.timeTaken,
            attemptedAt: attempt.attemptedAt,
        };
    }
};
exports.MCQRepository = MCQRepository;
exports.MCQRepository = MCQRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], MCQRepository);
//# sourceMappingURL=MCQRepository.js.map