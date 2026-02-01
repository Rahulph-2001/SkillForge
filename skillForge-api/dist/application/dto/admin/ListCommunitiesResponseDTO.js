"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCommunitiesResponseSchema = void 0;
const zod_1 = require("zod");
const CommunityResponseDTO_1 = require("../community/CommunityResponseDTO");
/**
 * Zod schema for pagination result metadata
 */
const PaginationMetadataSchema = zod_1.z.object({
    total: zod_1.z.number().int().min(0),
    page: zod_1.z.number().int().min(1),
    limit: zod_1.z.number().int().min(1),
    totalPages: zod_1.z.number().int().min(0),
    hasNextPage: zod_1.z.boolean(),
    hasPreviousPage: zod_1.z.boolean(),
});
/**
 * Zod schema for community statistics
 */
const CommunityStatsSchema = zod_1.z.object({
    totalCommunities: zod_1.z.number().int().min(0),
    totalMembers: zod_1.z.number().int().min(0),
    avgMembershipCost: zod_1.z.number().min(0),
});
/**
 * Zod schema for List Communities Response DTO (Admin)
 */
exports.ListCommunitiesResponseSchema = zod_1.z.object({
    communities: zod_1.z.array(CommunityResponseDTO_1.CommunityResponseDTOSchema),
    pagination: PaginationMetadataSchema,
    stats: CommunityStatsSchema,
});
//# sourceMappingURL=ListCommunitiesResponseDTO.js.map