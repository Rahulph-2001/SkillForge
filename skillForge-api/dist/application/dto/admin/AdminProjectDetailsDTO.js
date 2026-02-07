"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProjectDetailsDTOSchema = exports.AdminProjectDetailsRequestDTOSchema = void 0;
const zod_1 = require("zod");
exports.AdminProjectDetailsRequestDTOSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid('Invalid project ID'),
});
exports.AdminProjectDetailsDTOSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    category: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()),
    budget: zod_1.z.number(),
    duration: zod_1.z.string(),
    deadline: zod_1.z.string().nullable(),
    status: zod_1.z.string(),
    applicationsCount: zod_1.z.number(),
    isSuspended: zod_1.z.boolean(),
    suspendedAt: zod_1.z.coerce.date().nullable(),
    suspendReason: zod_1.z.string().nullable(),
    createdAt: zod_1.z.coerce.date(),
    updatedAt: zod_1.z.coerce.date(),
    creator: zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string(),
        email: zod_1.z.string(),
        avatarUrl: zod_1.z.string().nullable(),
        rating: zod_1.z.number(),
    }),
    contributor: zod_1.z.object({
        id: zod_1.z.string().uuid(),
        name: zod_1.z.string(),
        avatarUrl: zod_1.z.string().nullable(),
    }).nullable(),
    escrow: zod_1.z.object({
        amountHeld: zod_1.z.number(),
        status: zod_1.z.string(),
        releaseTo: zod_1.z.string(),
    }).nullable(),
});
//# sourceMappingURL=AdminProjectDetailsDTO.js.map