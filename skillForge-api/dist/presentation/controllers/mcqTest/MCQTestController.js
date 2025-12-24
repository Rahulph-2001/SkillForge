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
exports.MCQTestController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
const messages_1 = require("../../../config/messages");
let MCQTestController = class MCQTestController {
    constructor(templateQuestionRepository, skillTemplateRepository, responseBuilder) {
        this.templateQuestionRepository = templateQuestionRepository;
        this.skillTemplateRepository = skillTemplateRepository;
        this.responseBuilder = responseBuilder;
    }
    async getTest(req, res, next) {
        try {
            const { templateId, level } = req.params;
            const template = await this.skillTemplateRepository.findById(templateId);
            if (!template) {
                const response = this.responseBuilder.error('TEMPLATE_NOT_FOUND', messages_1.ERROR_MESSAGES.MCQ.TEMPLATE_NOT_FOUND, HttpStatusCode_1.HttpStatusCode.NOT_FOUND);
                res.status(response.statusCode).json(response.body);
                return;
            }
            if (template.status !== 'Active') {
                const response = this.responseBuilder.error('TEMPLATE_INACTIVE', messages_1.ERROR_MESSAGES.MCQ.TEMPLATE_INACTIVE, HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
                res.status(response.statusCode).json(response.body);
                return;
            }
            if (!template.levels.includes(level)) {
                const response = this.responseBuilder.error('INVALID_LEVEL', messages_1.ERROR_MESSAGES.MCQ.INVALID_LEVEL, HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
                res.status(response.statusCode).json(response.body);
                return;
            }
            const allQuestions = await this.templateQuestionRepository.findByTemplateIdAndLevel(templateId, level);
            const activeQuestions = allQuestions.filter((q) => q.isActive);
            if (activeQuestions.length === 0) {
                const response = this.responseBuilder.error('NO_QUESTIONS', messages_1.ERROR_MESSAGES.MCQ.NO_QUESTIONS, HttpStatusCode_1.HttpStatusCode.NOT_FOUND);
                res.status(response.statusCode).json(response.body);
                return;
            }
            const shuffled = activeQuestions.sort(() => Math.random() - 0.5);
            const selectedQuestions = shuffled.slice(0, template.mcqCount);
            const questionsForTest = selectedQuestions.map((q) => ({
                id: q.id,
                question: q.question,
                options: q.options,
            }));
            const response = this.responseBuilder.success({
                templateId: template.id,
                templateTitle: template.title,
                level,
                questions: questionsForTest,
                duration: 30,
                passingScore: template.passRange,
            }, messages_1.SUCCESS_MESSAGES.MCQ.TEST_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async submitTest(req, res, next) {
        try {
            const { templateId, level, answers } = req.body;
            if (!templateId || !level || !Array.isArray(answers)) {
                const response = this.responseBuilder.error('INVALID_REQUEST', messages_1.ERROR_MESSAGES.MCQ.INVALID_REQUEST, HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
                res.status(response.statusCode).json(response.body);
                return;
            }
            const template = await this.skillTemplateRepository.findById(templateId);
            if (!template) {
                const response = this.responseBuilder.error('TEMPLATE_NOT_FOUND', messages_1.ERROR_MESSAGES.MCQ.TEMPLATE_NOT_FOUND, HttpStatusCode_1.HttpStatusCode.NOT_FOUND);
                res.status(response.statusCode).json(response.body);
                return;
            }
            const allQuestions = await this.templateQuestionRepository.findByTemplateIdAndLevel(templateId, level);
            let correctAnswers = 0;
            const questionsWithAnswers = allQuestions.slice(0, answers.length).map((q, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === q.correctAnswer;
                if (isCorrect)
                    correctAnswers++;
                return {
                    id: q.id,
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                };
            });
            const totalQuestions = answers.length;
            const score = Math.round((correctAnswers / totalQuestions) * 100);
            const passed = score >= template.passRange;
            const response = this.responseBuilder.success({
                score,
                totalQuestions,
                correctAnswers,
                passed,
                questions: questionsWithAnswers,
            }, passed ? messages_1.SUCCESS_MESSAGES.MCQ.TEST_SUBMITTED_PASS : messages_1.SUCCESS_MESSAGES.MCQ.TEST_SUBMITTED_FAIL, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async getHistory(_req, res, next) {
        try {
            const response = this.responseBuilder.success([], messages_1.SUCCESS_MESSAGES.MCQ.HISTORY_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.MCQTestController = MCQTestController;
exports.MCQTestController = MCQTestController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ITemplateQuestionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISkillTemplateRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object])
], MCQTestController);
//# sourceMappingURL=MCQTestController.js.map