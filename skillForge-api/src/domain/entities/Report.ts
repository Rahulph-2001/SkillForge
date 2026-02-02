
export enum ReportType {
    USER_REPORT = 'USER_REPORT',
    PROJECT_DISPUTE = 'PROJECT_DISPUTE',
    COMMUNITY_CONTENT = 'COMMUNITY_CONTENT'
}

export enum ReportStatus {
    PENDING = 'PENDING',
    REVIEWING = 'REVIEWING',
    RESOLVED = 'RESOLVED',
    DISMISSED = 'DISMISSED'
}

export interface ReportProps {
    id?: string;
    reporterId: string;
    type: ReportType;
    category: string;
    description: string;
    status: ReportStatus;

    // Targets
    targetUserId?: string | null;
    projectId?: string | null;

    // Resolution
    resolution?: string | null;
    resolvedBy?: string | null;
    resolvedAt?: Date | null;

    // Metadata
    createdAt: Date;
    updatedAt: Date;

    // Relations (optional for domain entity depending on usage)
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

export class Report {
    constructor(public readonly props: ReportProps) { }

    static create(props: ReportProps): Report {
        return new Report(props);
    }

    get id(): string | undefined {
        return this.props.id;
    }

    public toJSON(): ReportProps {
        return { ...this.props };
    }
}
