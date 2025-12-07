import axiosInstance from '../lib/axios'; // Assuming you have a centralized axios instance

export interface McqImportJobResponse {
  id: string;
  fileName: string;
  templateId: string;
  adminId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'completed_with_errors' | 'failed';
  totalRows: number;
  processedRows: number;
  successfulRows: number;
  failedRows: number;
  errorFileUrl: string | null;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export const McqImportApi = {
  /**
   * POST: Uploads the CSV file and starts the import job.
   * @param templateId The ID of the skill template.
   * @param file The CSV file to upload.
   */
  startImport: async (templateId: string, file: File): Promise<{ jobId: string; message: string }> => {
    const formData = new FormData();
    formData.append('csvFile', file); // 'csvFile' must match the key used in Multer on the backend

    const response = await axiosInstance.post<{ data: { jobId: string; message: string } }>(
      `/admin/mcq/${templateId}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * GET: Fetches the list of all import jobs for a template.
   * @param templateId The ID of the skill template.
   */
  listJobs: async (templateId: string): Promise<McqImportJobResponse[]> => {
    const response = await axiosInstance.get<{ data: { jobs: McqImportJobResponse[] } }>(
      `/admin/mcq/${templateId}/status`
    );
    return response.data.data.jobs;
  },

  /**
   * GET: Downloads the error CSV file.
   * The browser handles the download directly.
   * @param jobId The ID of the failed job.
   */
  getDownloadErrorUrl: (jobId: string): string => {
    // This assumes your axiosInstance base URL is set correctly
    return `${axiosInstance.defaults.baseURL}/admin/mcq/errors/${jobId}/download`;
  },
};