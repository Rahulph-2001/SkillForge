"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateQuestion = void 0;
class TemplateQuestion {
    constructor(_id, _templateId, _level, _question, _options, _correctAnswer, _explanation, _isActive, _createdAt, _updatedAt) {
        this._id = _id;
        this._templateId = _templateId;
        this._level = _level;
        this._question = _question;
        this._options = _options;
        this._correctAnswer = _correctAnswer;
        this._explanation = _explanation;
        this._isActive = _isActive;
        this._createdAt = _createdAt;
        this._updatedAt = _updatedAt;
        this.validate();
    }
    validate() {
        if (!this._question || this._question.trim().length < 10) {
            throw new Error('Question must be at least 10 characters long');
        }
        if (!this._options || this._options.length !== 4) {
            throw new Error('Must provide exactly 4 options');
        }
        if (this._correctAnswer < 0 || this._correctAnswer > 3) {
            throw new Error('Correct answer must be between 0 and 3');
        }
        const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
        if (!validLevels.includes(this._level)) {
            throw new Error('Invalid level. Must be Beginner, Intermediate, or Advanced');
        }
    }
    static create(id, templateId, level, question, options, correctAnswer, explanation, isActive, createdAt, updatedAt) {
        return new TemplateQuestion(id, templateId, level, question, options, correctAnswer, explanation, isActive, createdAt, updatedAt);
    }
    get id() {
        return this._id;
    }
    get templateId() {
        return this._templateId;
    }
    get level() {
        return this._level;
    }
    get question() {
        return this._question;
    }
    get options() {
        return this._options;
    }
    get correctAnswer() {
        return this._correctAnswer;
    }
    get explanation() {
        return this._explanation;
    }
    get isActive() {
        return this._isActive;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    toJSON() {
        return {
            id: this._id,
            templateId: this._templateId,
            level: this._level,
            question: this._question,
            options: this._options,
            correctAnswer: this._correctAnswer,
            explanation: this._explanation,
            isActive: this._isActive,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}
exports.TemplateQuestion = TemplateQuestion;
//# sourceMappingURL=TemplateQuestion.js.map