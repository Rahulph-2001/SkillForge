"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTemplateQuestionSchema = void 0;
const zod_1 = require("zod");
exports.CreateTemplateQuestionSchema = zod_1.z.object({
    templateId: zod_1.z.string().uuid('Invalid template ID'),
    level: zod_1.z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
        message: 'Invalid question level',
    }),
    question: zod_1.z.string()
        .min(10, 'Question must be at least 10 characters')
        .max(1000, 'Question too long')
        .trim(),
    options: zod_1.z.array(zod_1.z.string().min(1, 'Option cannot be empty').max(500, 'Option too long'))
        .length(4, 'Exactly 4 options are required'),
    correctAnswer: zod_1.z.number()
        .int('Must be an integer')
        .min(0, 'Correct answer must be between 0 and 3')
        .max(3, 'Correct answer must be between 0 and 3'),
    explanation: zod_1.z.string()
        .max(1000, 'Explanation too long')
        .trim()
        .optional(),
    isActive: zod_1.z.boolean()
        .optional()
        .default(true),
});
//# sourceMappingURL=CreateTemplateQuestionDTO.js.map