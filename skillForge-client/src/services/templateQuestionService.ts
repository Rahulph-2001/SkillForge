import api from './api';

export interface TemplateQuestion {
  id: string;
  templateId: string;
  level: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionDTO {
  templateId: string;
  level: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface UpdateQuestionDTO {
  question?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  isActive?: boolean;
}

const templateQuestionService = {
  // Create a new question
  async createQuestion(templateId: string, data: Omit<CreateQuestionDTO, 'templateId'>) {
    const response = await api.post(`/admin/skill-templates/${templateId}/questions`, data);
    return response.data;
  },

  // Get all questions for a template (optionally filtered by level)
  async getQuestions(templateId: string, level?: string) {
    const params = level ? { level } : {};
    const response = await api.get(`/admin/skill-templates/${templateId}/questions`, { params });
    return response.data;
  },

  // Update a question
  async updateQuestion(templateId: string, questionId: string, data: UpdateQuestionDTO) {
    const response = await api.put(`/admin/skill-templates/${templateId}/questions/${questionId}`, data);
    return response.data;
  },

  // Delete a question
  async deleteQuestion(templateId: string, questionId: string) {
    const response = await api.delete(`/admin/skill-templates/${templateId}/questions/${questionId}`);
    return response.data;
  },

  // Bulk delete questions
  async bulkDeleteQuestions(templateId: string, questionIds: string[]) {
    const response = await api.delete(`/admin/skill-templates/${templateId}/questions/bulk`, {
      data: { questionIds }
    });
    return response.data;
  },
};

export default templateQuestionService;
