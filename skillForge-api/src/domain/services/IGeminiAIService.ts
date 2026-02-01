import { MatchAnalysis } from '../entities/ProjectApplication';

export interface ApplicantProfile {
  id: string;
  name: string;
  bio: string | null;
  skills: string[];
  rating: number;
  reviewCount: number;
  totalSessionsCompleted: number;
  skillDetails: Array<{
    title: string;
    category: string;
    level: string;
    rating: number;
    totalSessions: number;
  }>;
}

export interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  budget: number;
  duration: string;
}

export interface IGeminiAIService {
  analyzeApplicantMatch(
    project: ProjectDetails,
    applicant: ApplicantProfile,
    coverLetter: string
  ): Promise<MatchAnalysis>;
}