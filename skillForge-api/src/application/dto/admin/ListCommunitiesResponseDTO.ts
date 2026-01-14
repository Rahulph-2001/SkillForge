import { z } from 'zod';
import { CommunityResponseDTOSchema } from '../community/CommunityResponseDTO';

/**
 * Zod schema for pagination result metadata
 */
const PaginationMetadataSchema = z.object({
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    totalPages: z.number().int().min(0),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
});

/**
 * Zod schema for community statistics
 */
const CommunityStatsSchema = z.object({
    totalCommunities: z.number().int().min(0),
    totalMembers: z.number().int().min(0),
    avgMembershipCost: z.number().min(0),
});

/**
 * Zod schema for List Communities Response DTO (Admin)
 */
export const ListCommunitiesResponseSchema = z.object({
    communities: z.array(CommunityResponseDTOSchema),
    pagination: PaginationMetadataSchema,
    stats: CommunityStatsSchema,
});

export type ListCommunitiesResponseDTO = z.infer<typeof ListCommunitiesResponseSchema>;
export type PaginationMetadata = z.infer<typeof PaginationMetadataSchema>;
export type CommunityStats = z.infer<typeof CommunityStatsSchema>;
