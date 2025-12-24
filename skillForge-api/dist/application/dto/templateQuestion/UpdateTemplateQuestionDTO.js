"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTemplateQuestionSchema = void 0;
const zod_1 = require("zod");
exports.UpdateTemplateQuestionSchema = zod_1.z.object({
    level: zod_1.z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
        message: 'Invalid question level',
    }).optional(),
    question: zod_1.z.string()
        .min(10, 'Question must be at least 10 characters')
        .max(1000, 'Question too long')
        .trim()
        .optional(),
    options: zod_1.z.array(zod_1.z.string().min(1, 'Option cannot be empty').max(500, 'Option too long'))
        .length(4, 'Exactly 4 options are required')
        .optional(),
    correctAnswer: zod_1.z.number()
        .int('Must be an integer')
        .min(0, 'Correct answer must be between 0 and 3')
        .max(3, 'Correct answer must be between 0 and 3')
        .optional(),
    explanation: zod_1.z.string()
        .max(1000, 'Explanation too long')
        .trim()
        .optional(),
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=UpdateTemplateQuestionDTO.js.map