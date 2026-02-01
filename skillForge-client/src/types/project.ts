export interface Project {
    id: string;
    clientId: string;
    title: string;
    status: 'Open' | 'In_Progress' | 'Pending_Completion' | 'Completed' | 'Cancelled';
    category: string;
    description: string;
    tags: string[];
    budget: number;
    duration: string;
    deadline?: string;
    paymentId?: string;
    applicationsCount: number;
    createdAt: string;
    updatedAt: string;
    client?: {
        id?: string;
        name: string;
        avatar?: string;
        avatarUrl?: string;
        rating?: number;
        isVerified?: boolean;
    };
    acceptedContributor?: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
}

