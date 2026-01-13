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
let MCQTestController = class MCQTestController {
    constructor(startMCQTestUseCase, submitMCQTestUseCase, responseBuilder) {
        this.startMCQTestUseCase = startMCQTestUseCase;
        this.submitMCQTestUseCase = submitMCQTestUseCase;
        this.responseBuilder = responseBuilder;
        this.startTest = async (req, res, next) => {
            try {
                const { skillId } = req.params;
                const userId = req.user.userId;
                const testSession = await this.startMCQTestUseCase.execute({ skillId, userId });
                const response = this.responseBuilder.success(testSession, 'MCQ test started successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Submit MCQ test answers
         * POST /api/v1/mcq/submit
         */
        this.submitTest = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { skillId, questionIds, answers, timeTaken } = req.body;
                // Validate input
                if (!skillId || !Array.isArray(questionIds) || !Array.isArray(answers)) {
                    const errorResponse = this.responseBuilder.error('VALIDATION_ERROR', 'Invalid request: skillId, questionIds, and answers are required', HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
                    res.status(errorResponse.statusCode).json(errorResponse.body);
                    return;
                }
                if (questionIds.length !== answers.length) {
                    const errorResponse = this.responseBuilder.error('VALIDATION_ERROR', 'Number of questionIds must match number of answers', HttpStatusCode_1.HttpStatusCode.BAD_REQUEST);
                    res.status(errorResponse.statusCode).json(errorResponse.body);
                    return;
                }
                const result = await this.submitMCQTestUseCase.execute({
                    skillId,
                    userId,
                    questionIds,
                    answers,
                    timeTaken,
                });
                const response = this.responseBuilder.success(result, 'MCQ test submitted successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.MCQTestController = MCQTestController;
exports.MCQTestController = MCQTestController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IStartMCQTestUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISubmitMCQTestUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object])
], MCQTestController);
//# sourceMappingURL=MCQTestController.js.map