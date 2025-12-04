export interface PendingSkillDTO {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsPerHour: number;
  tags: string[];
  imageUrl: string | null;
  templateId: string | null;
  status: string;
  verificationStatus: string | null;
  mcqScore: number | null;
  mcqTotalQuestions: number | null;
  mcqPassingScore: number | null;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
