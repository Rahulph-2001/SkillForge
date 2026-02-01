import { v4 as uuidv4 } from 'uuid';

export enum ProjectApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  SHORTLISTED = 'SHORTLISTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface MatchAnalysis {
  overallScore: number;
  skillsMatch: {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    analysis: string;
  };
  experienceMatch: {
    score: number;
    relevantExperience: string;
    analysis: string;
  };
  ratingMatch: {
    score: number;
    providerRating: number;
    reviewCount: number;
    analysis: string;
  };
  coverLetterAnalysis: {
    score: number;
    strengths: string[];
    concerns: string[];
    analysis: string;
  };
  recommendation: string;
  confidence: number;
}

export interface CreateProjectApplicationProps {
  id?: string;
  projectId: string;
  applicantId: string;
  coverLetter: string;
  proposedBudget?: number | null;
  proposedDuration?: string | null;
  status?: ProjectApplicationStatus;
  matchScore?: number | null;
  matchAnalysis?: MatchAnalysis | null;
  createdAt?: Date;
  updatedAt?: Date;
  reviewedAt?: Date | null;
  project?: any;
  applicant?: any;
  interviews?: any[];
}

export class ProjectApplication {
  private readonly _id: string;
  private readonly _projectId: string;
  private readonly _applicantId: string;
  private readonly _coverLetter: string;
  private readonly _proposedBudget: number | null;
  private readonly _proposedDuration: string | null;
  private _status: ProjectApplicationStatus;
  private _matchScore: number | null;
  private _matchAnalysis: MatchAnalysis | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _reviewedAt: Date | null;

  public readonly project?: any;
  public readonly applicant?: any;
  public readonly interviews?: any[]; // Keep as any[] to avoid circular dependency for now

  constructor(props: CreateProjectApplicationProps) {
    this._id = props.id || uuidv4();
    this._projectId = props.projectId;
    this._applicantId = props.applicantId;
    this._coverLetter = props.coverLetter;
    this._proposedBudget = props.proposedBudget ?? null;
    this._proposedDuration = props.proposedDuration ?? null;
    this._status = props.status || ProjectApplicationStatus.PENDING;
    this._matchScore = props.matchScore ?? null;
    this._matchAnalysis = props.matchAnalysis ?? null;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._reviewedAt = props.reviewedAt ?? null;

    this.project = props.project;
    this.applicant = props.applicant;
    this.interviews = props.interviews;

    this.validate();
  }

  private validate(): void {
    if (!this._projectId) {
      throw new Error('Project ID is required');
    }
    if (!this._applicantId) {
      throw new Error('Applicant ID is required');
    }
    if (!this._coverLetter || this._coverLetter.trim().length < 50) {
      throw new Error('Cover letter must be at least 50 characters');
    }
    if (this._proposedBudget !== null && this._proposedBudget < 0) {
      throw new Error('Proposed budget cannot be negative');
    }
  }

  // Getters
  public get id(): string { return this._id; }
  public get projectId(): string { return this._projectId; }
  public get applicantId(): string { return this._applicantId; }
  public get coverLetter(): string { return this._coverLetter; }
  public get proposedBudget(): number | null { return this._proposedBudget; }
  public get proposedDuration(): string | null { return this._proposedDuration; }
  public get status(): ProjectApplicationStatus { return this._status; }
  public get matchScore(): number | null { return this._matchScore; }
  public get matchAnalysis(): MatchAnalysis | null { return this._matchAnalysis; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }
  public get reviewedAt(): Date | null { return this._reviewedAt; }

  // Domain methods
  public setMatchScore(score: number, analysis: MatchAnalysis): void {
    this._matchScore = score;
    this._matchAnalysis = analysis;
    this._status = ProjectApplicationStatus.REVIEWED;
    this._reviewedAt = new Date();
    this._updatedAt = new Date();
  }

  public shortlist(): void {
    if (this._status !== ProjectApplicationStatus.REVIEWED && this._status !== ProjectApplicationStatus.PENDING) {
      throw new Error('Application must be pending or reviewed before shortlisting');
    }
    this._status = ProjectApplicationStatus.SHORTLISTED;
    this._updatedAt = new Date();
  }

  public accept(): void {
    if (
      this._status !== ProjectApplicationStatus.SHORTLISTED &&
      this._status !== ProjectApplicationStatus.REVIEWED &&
      this._status !== ProjectApplicationStatus.PENDING
    ) {
      throw new Error('Application must be pending, reviewed, or shortlisted before accepting');
    }
    this._status = ProjectApplicationStatus.ACCEPTED;
    this._updatedAt = new Date();
  }

  public reject(): void {
    this._status = ProjectApplicationStatus.REJECTED;
    this._updatedAt = new Date();
  }

  public withdraw(): void {
    if (this._status === ProjectApplicationStatus.ACCEPTED) {
      throw new Error('Cannot withdraw accepted application');
    }
    this._status = ProjectApplicationStatus.WITHDRAWN;
    this._updatedAt = new Date();
  }

  public canBeModified(): boolean {
    return this._status === ProjectApplicationStatus.PENDING;
  }

  public toJSON(): any {
    return {
      id: this.id,
      projectId: this.projectId,
      applicantId: this.applicantId,
      coverLetter: this.coverLetter,
      proposedBudget: this.proposedBudget,
      proposedDuration: this.proposedDuration,
      status: this.status,
      matchScore: this.matchScore,
      matchAnalysis: this.matchAnalysis,
      appliedAt: this.createdAt, // Frontend expects appliedAt
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      reviewedAt: this.reviewedAt,
      project: this.project,
      applicant: this.applicant,
      interviews: this.interviews,
    };
  }
}