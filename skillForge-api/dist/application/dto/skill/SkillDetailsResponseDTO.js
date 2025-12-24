"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillDetailsDTOSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Skill Details DTO
 */
exports.SkillDetailsDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid skill ID'),
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    category: zod_1.z.string().min(1, 'Category is required'),
    level: zod_1.z.string().min(1, 'Level is required'),
    durationHours: zod_1.z.number().min(0, 'Duration must be non-negative'),
    creditsPerHour: zod_1.z.number().min(0, 'Credits per hour must be non-negative'),
    imageUrl: zod_1.z.string().url('Invalid image URL').nullable(),
    tags: zod_1.z.array(zod_1.z.string()),
    rating: zod_1.z.number().min(0).max(5, 'Rating must be between 0 and 5'),
    totalSessions: zod_1.z.number().int().min(0, 'Total sessions must be non-negative'),
    provider: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid provider ID'),
        name: zod_1.z.string().min(1, 'Provider name is required'),
        email: zod_1.z.string().email('Invalid email address'),
        rating: zod_1.z.number().min(0).max(5, 'Rating must be between 0 and 5'),
        reviewCount: zod_1.z.number().int().min(0, 'Review count must be non-negative'),
    }),
    availability: zod_1.z.object({
        weeklySchedule: zod_1.z.record(zod_1.z.string(), zod_1.z.object({
            enabled: zod_1.z.boolean(),
            slots: zod_1.z.array(zod_1.z.object({
                start: zod_1.z.string(),
                end: zod_1.z.string(),
            })),
        })),
        blockedDates: zod_1.z.array(zod_1.z.object({
            date: zod_1.z.coerce.date(),
            reason: zod_1.z.string().optional(),
        })),
        timezone: zod_1.z.string().min(1, 'Timezone is required'),
        bookedSlots: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string().uuid('Invalid slot ID'),
            title: zod_1.z.string(),
            date: zod_1.z.string(),
            startTime: zod_1.z.string(),
            endTime: zod_1.z.string(),
        })).optional(),
    }).nullable(),
});
//# sourceMappingURL=SkillDetailsResponseDTO.js.map