export declare enum ProjectApplicationStatus {
    PENDING = "PENDING",
    REVIEWED = "REVIEWED",
    SHORTLISTED = "SHORTLISTED",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    WITHDRAWN = "WITHDRAWN"
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
export declare class ProjectApplication {
    private readonly _id;
    private readonly _projectId;
    private readonly _applicantId;
    private readonly _coverLetter;
    private readonly _proposedBudget;
    private readonly _proposedDuration;
    private _status;
    private _matchScore;
    private _matchAnalysis;
    private readonly _createdAt;
    private _updatedAt;
    private _reviewedAt;
    readonly project?: any;
    readonly applicant?: any;
    readonly interviews?: any[];
    constructor(props: CreateProjectApplicationProps);
    private validate;
    get id(): string;
    get projectId(): string;
    get applicantId(): string;
    get coverLetter(): string;
    get proposedBudget(): number | null;
    get proposedDuration(): string | null;
    get status(): ProjectApplicationStatus;
    get matchScore(): number | null;
    get matchAnalysis(): MatchAnalysis | null;
    get createdAt(): Date;
    get updatedAt(): Date;
    get reviewedAt(): Date | null;
    setMatchScore(score: number, analysis: MatchAnalysis): void;
    shortlist(): void;
    accept(): void;
    reject(): void;
    withdraw(): void;
    canBeModified(): boolean;
    toJSON(): any;
}
//# sourceMappingURL=ProjectApplication.d.ts.map