import api from './api';

export interface CreateReportDTO {
    type: 'USER_REPORT' | 'PROJECT_DISPUTE' | 'COMMUNITY_CONTENT';
    category: string;
    description: string;
    projectId?: string;
    targetUserId?: string;
}

export const createReport = async (data: CreateReportDTO): Promise<void> => {
    try {
        await api.post('/reports', data);
    } catch (error: any) {
        throw error;
    }
};
