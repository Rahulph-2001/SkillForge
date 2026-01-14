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
  status: 'Open' | 'In_Progress' | 'Completed' | 'Cancelled';
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
  }
};

export default projectService;

