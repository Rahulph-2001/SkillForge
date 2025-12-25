export interface Project {
    id: string;
    clientId: string;
    title: string;
    status: 'Open' | 'In_Progress' | 'Completed' | 'Cancelled';
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
        name: string;
        avatar?: string;
        rating?: number;
        isVerified?: boolean;
    };
}
