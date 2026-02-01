import api from './api';

export enum ProjectApplicationStatus {
    PENDING = 'PENDING',
    REVIEWED = 'REVIEWED',
    SHORTLISTED = 'SHORTLISTED',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN',
}

export interface MatchAnalysis {
    technicalScore?: number;
    experienceScore?: number;
    overallScore: number;
    strengths?: string[];
    weaknesses?: string[];
    recommendation: string;
    coverLetterAnalysis?: {
        score: number;
        strengths: string[];
        concerns: string[];
        analysis: string;
    };
    skillsMatch?: {
        score: number;
        matchedSkills: string[];
        missingSkills: string[];
        analysis: string;
    };
}

export interface ProjectApplication {
    id: string;
    projectId: string;
    applicantId: string;
    coverLetter: string;
    proposedBudget: number;
    proposedDuration: string;
    status: ProjectApplicationStatus;
    matchScore?: number;
    matchAnalysis?: MatchAnalysis;
    appliedAt: string;
    updatedAt: string;
    applicant?: {
        id: string;
        name: string;
        avatarUrl?: string;
        rating?: number;
        reviewCount?: number;
        skillsOffered?: string[];
    };
    project?: {
        id: string;
        title: string;
        budget: number;
        duration: string;
    };
    interviews?: {
        id: string;
        scheduledAt: string;
        durationMinutes: number;
        status: string;
        videoCallRoomId?: string;
    }[];
}

export interface CreateProjectApplicationRequest {
    coverLetter: string;
    proposedBudget?: number;
    proposedDuration: string;
}

export interface UpdateApplicationStatusRequest {
    status: 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';
}

const projectApplicationService = {
    applyToProject: async (projectId: string, data: CreateProjectApplicationRequest): Promise<ProjectApplication> => {
        const response = await api.post(`/project-applications/projects/${projectId}/apply`, data);
        return response.data.data;
    },

    getProjectApplications: async (projectId: string): Promise<ProjectApplication[]> => {
        const response = await api.get(`/project-applications/projects/${projectId}/applications`);
        return response.data.data;
    },

    getMyApplications: async (): Promise<ProjectApplication[]> => {
        const response = await api.get('/project-applications/my-applications');
        return response.data.data;
    },

    updateStatus: async (applicationId: string, status: UpdateApplicationStatusRequest['status']): Promise<ProjectApplication> => {
        const response = await api.patch(`/project-applications/${applicationId}/status`, { status });
        return response.data.data;
    },

    withdrawApplication: async (applicationId: string): Promise<ProjectApplication> => {
        const response = await api.post(`/project-applications/${applicationId}/withdraw`);
        return response.data.data;
    },

    getReceivedApplications: async (): Promise<ProjectApplication[]> => {
        const response = await api.get('/project-applications/received');
        return response.data.data;
    },

    scheduleInterview: async (data: { applicationId: string; scheduledAt: Date; durationMinutes: number }): Promise<any> => {
        const response = await api.post('/interviews/schedule', data);
        return response.data.data;
    },

    getInterviews: async (applicationId: string): Promise<any[]> => {
        const response = await api.get(`/interviews/application/${applicationId}`);
        return response.data.data;
    },
};

export default projectApplicationService;
