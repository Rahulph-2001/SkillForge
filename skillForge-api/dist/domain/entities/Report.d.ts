export declare enum ReportType {
    USER_REPORT = "USER_REPORT",
    PROJECT_DISPUTE = "PROJECT_DISPUTE",
    COMMUNITY_CONTENT = "COMMUNITY_CONTENT"
}
export declare enum ReportStatus {
    PENDING = "PENDING",
    REVIEWING = "REVIEWING",
    RESOLVED = "RESOLVED",
    DISMISSED = "DISMISSED"
}
export interface ReportProps {
    id?: string;
    reporterId: string;
    type: ReportType;
    category: string;
    description: string;
    status: ReportStatus;
    targetUserId?: string | null;
    projectId?: string | null;
    resolution?: string | null;
    resolvedBy?: string | null;
    resolvedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    reporter?: {
        id: string;
        name: string;
        avatarUrl?: string | null;
        email: string;
    };
    project?: {
        id: string;
        title: string;
    };
}
export declare class Report {
    readonly props: ReportProps;
    constructor(props: ReportProps);
    static create(props: ReportProps): Report;
    get id(): string | undefined;
    get reporterId(): string;
    toJSON(): ReportProps;
}
//# sourceMappingURL=Report.d.ts.map