import { z } from 'zod';

export const BrowseSkillsRequestSchema = z.object({
  category: z.string()
    .max(100, 'Category too long')
    .optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    message: 'Invalid skill level',
  }).optional(),
  search: z.string()
    .max(255, 'Search query too long')
    .trim()
    .optional(),
  minCredits: z.number()
    .int('Must be an integer')
    .min(0, 'Cannot be negative')
    .optional(),
  maxCredits: z.number()
    .int('Must be an integer')
    .min(0, 'Cannot be negative')
    .optional(),
  page: z.number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .optional()
    .default(1),
  limit: z.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(20),
  sortBy: z.enum(['rating', 'credits', 'createdAt'], {
    message: 'Invalid sort field',
  }).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc'], {
    message: 'Invalid sort order',
  }).optional().default('desc'),
  excludeProviderId: z.string()
    .uuid('Invalid provider ID')
    .optional(),
}).refine((data) => {
  if (data.minCredits !== undefined && data.maxCredits !== undefined) {
    return data.minCredits <= data.maxCredits;
  }
  return true;
}, {
  message: 'Min credits cannot be greater than max credits',
  path: ['maxCredits'],
});

export type BrowseSkillsRequestDTO = z.infer<typeof BrowseSkillsRequestSchema>;
