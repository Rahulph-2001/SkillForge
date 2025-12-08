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
exports.TemplateQuestionRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const Database_1 = require("../Database");
const TemplateQuestion_1 = require("../../../domain/entities/TemplateQuestion");
let TemplateQuestionRepository = class TemplateQuestionRepository {
    constructor(database) {
        this.database = database;
    }
    async create(question) {
        const created = await this.database.getClient().templateQuestion.create({
            data: {
                id: question.id,
                templateId: question.templateId,
                level: question.level,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                isActive: question.isActive,
            },
        });
        return TemplateQuestion_1.TemplateQuestion.create(created.id, created.templateId, created.level, created.question, created.options, created.correctAnswer, created.explanation, created.isActive, created.createdAt, created.updatedAt);
    }
    async findById(id) {
        const found = await this.database.getClient().templateQuestion.findUnique({
            where: { id },
        });
        if (!found)
            return null;
        return TemplateQuestion_1.TemplateQuestion.create(found.id, found.templateId, found.level, found.question, found.options, found.correctAnswer, found.explanation, found.isActive, found.createdAt, found.updatedAt);
    }
    async findByTemplateId(templateId) {
        const questions = await this.database.getClient().templateQuestion.findMany({
            where: { templateId, isActive: true },
            orderBy: { createdAt: 'desc' },
        });
        return questions.map((q) => TemplateQuestion_1.TemplateQuestion.create(q.id, q.templateId, q.level, q.question, q.options, q.correctAnswer, q.explanation, q.isActive, q.createdAt, q.updatedAt));
    }
    async findByTemplateIdAndLevel(templateId, level) {
        const questions = await this.database.getClient().templateQuestion.findMany({
            where: { templateId, level, isActive: true },
            orderBy: { createdAt: 'desc' },
        });
        return questions.map((q) => TemplateQuestion_1.TemplateQuestion.create(q.id, q.templateId, q.level, q.question, q.options, q.correctAnswer, q.explanation, q.isActive, q.createdAt, q.updatedAt));
    }
    async update(id, data) {
        const updated = await this.database.getClient().templateQuestion.update({
            where: { id },
            data,
        });
        return TemplateQuestion_1.TemplateQuestion.create(updated.id, updated.templateId, updated.level, updated.question, updated.options, updated.correctAnswer, updated.explanation, updated.isActive, updated.createdAt, updated.updatedAt);
    }
    async delete(id) {
        await this.database.getClient().templateQuestion.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async bulkDelete(ids) {
        const result = await this.database.getClient().templateQuestion.updateMany({
            where: {
                id: { in: ids },
                isActive: true
            },
            data: { isActive: false },
        });
        return result.count;
    }
    async countByTemplateId(templateId) {
        return this.database.getClient().templateQuestion.count({
            where: { templateId, isActive: true },
        });
    }
    async countByTemplateIdAndLevel(templateId, level) {
        return this.database.getClient().templateQuestion.count({
            where: { templateId, level, isActive: true },
        });
    }
    async getRandomQuestions(templateId, level, count) {
        const questions = await this.database.getClient().templateQuestion.findMany({
            where: { templateId, level, isActive: true },
        });
        // Shuffle and take 'count' questions
        const shuffled = questions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);
        return selected.map((q) => TemplateQuestion_1.TemplateQuestion.create(q.id, q.templateId, q.level, q.question, q.options, q.correctAnswer, q.explanation, q.isActive, q.createdAt, q.updatedAt));
    }
    async createMany(questions) {
        const result = await this.database.getClient().templateQuestion.createMany({
            data: questions.map(q => ({
                id: q.id,
                templateId: q.templateId,
                level: q.level,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                isActive: q.isActive,
                createdAt: q.createdAt,
                updatedAt: q.updatedAt
            }))
        });
        return result.count;
    }
};
exports.TemplateQuestionRepository = TemplateQuestionRepository;
exports.TemplateQuestionRepository = TemplateQuestionRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], TemplateQuestionRepository);
//# sourceMappingURL=TemplateQuestionRepository.js.map