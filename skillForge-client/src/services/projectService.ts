import api from './api';

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  budget: number;
  duration: string;
  deadline?: string;
  status: 'Open' | 'In_Progress' | 'Pending_Completion' | 'Payment_Pending' | 'Refund_Pending' | 'Completed' | 'Cancelled';
  paymentId?: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
  client?: {
    id?: string;
    name: string;
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

export interface ProjectMessage {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  isMine?: boolean;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  budget: number;
  duration: string;
  deadline?: string;
}

export interface ListProjectsRequest {
  search?: string;
  category?: string;
  status?: 'Open' | 'In_Progress' | 'Completed' | 'Cancelled';
  page?: number;
  limit?: number;
}

export interface ListProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const projectService = {
  listProjects: async (filters?: ListProjectsRequest): Promise<ListProjectsResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/projects?${params.toString()}`);
    return response.data.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data.data;
  },

  applyToProject: async (id: string, data: any): Promise<void> => {
    await api.post(`/projects/${id}/apply`, data);
  },

  getMyProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects/my-projects');
    return response.data.data;
  },

  getContributingProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects/contributing');
    return response.data.data;
  },

  requestCompletion: async (id: string): Promise<void> => {
    await api.post(`/projects/${id}/complete`);
  },

  reviewCompletion: async (id: string, decision: 'APPROVE' | 'REQUEST_CHANGES' | 'REJECT', reason?: string): Promise<void> => {
    await api.post(`/projects/${id}/review`, { decision, reason });
  },

  getMessages: async (projectId: string): Promise<ProjectMessage[]> => {
    const response = await api.get(`/projects/${projectId}/messages`);
    return response.data.data;
  },

  sendMessage: async (projectId: string, content: string): Promise<ProjectMessage> => {
    const response = await api.post(`/projects/${projectId}/messages`, { content });
    return response.data.data;
  }
};

export default projectService;
