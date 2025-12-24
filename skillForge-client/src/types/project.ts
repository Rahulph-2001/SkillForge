export interface Project {
    id: string;
    title: string;
    status: 'Open' | 'In Progress' | 'Completed';
    category: string;
    description: string;
    tags: string[];
    budget: number;
    duration: string;
    applicationsCount: number;
    postedAt: string;
    client: {
        name: string;
        avatar: string; // URL
        rating: number;
        isVerified: boolean;
    };
}
