import { z } from 'zod';

export const ProjectApplicationResponseDTOSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  applicantId: z.string().uuid(),
  coverLetter: z.string(),
  proposedBudget: z.number().nullable(),
  proposedDuration: z.string().nullable(),
  status: z.string(),
  matchScore: z.number().nullable(),
  matchAnalysis: z.any().nullable(),
  applicant: z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
    rating: z.number(),
    reviewCount: z.number(),
    skillsOffered: z.array(z.string()),
  }).optional(),
  project: z.object({
    id: z.string(),
    title: z.string(),
    budget: z.number(),
    duration: z.string(),
  }).optional(),
  interviews: z.array(z.object({
    id: z.string(),
    scheduledAt: z.coerce.date(),
    durationMinutes: z.number(),
    status: z.string(),
    videoCallRoomId: z.string().nullable().optional(),
  })).optional(),
  appliedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  reviewedAt: z.coerce.date().nullable(),
});

export type ProjectApplicationResponseDTO = z.infer<typeof ProjectApplicationResponseDTOSchema>;