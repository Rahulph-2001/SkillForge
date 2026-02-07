import { z } from 'zod';

export const AdminProjectDetailsRequestDTOSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
});

export type AdminProjectDetailsRequestDTO = z.infer<typeof AdminProjectDetailsRequestDTOSchema>;

export const AdminProjectDetailsDTOSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  budget: z.number(),
  duration: z.string(),
  deadline: z.string().nullable(),
  status: z.string(),
  applicationsCount: z.number(),
  isSuspended: z.boolean(),
  suspendedAt: z.coerce.date().nullable(),
  suspendReason: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  creator: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string(),
    avatarUrl: z.string().nullable(),
    rating: z.number(),
  }),
  contributor: z.object({
    id: z.string().uuid(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
  }).nullable(),
  escrow: z.object({
    amountHeld: z.number(),
    status: z.string(),
    releaseTo: z.string(),
  }).nullable(),
});

export type AdminProjectDetailsDTO = z.infer<typeof AdminProjectDetailsDTOSchema>;