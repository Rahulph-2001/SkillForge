import React, { useState, useEffect, useCallback, useRef } from 'react';
import { McqImportApi, McqImportJobResponse } from '../../services/mcqService';
import { Upload, FileText, CheckCircle, AlertCircle, Clock, Download } from 'lucide-react';
import SuccessModal from '../common/Modal/SuccessModal';
import ErrorModal from '../common/Modal/ErrorModal';

// --- Utility Components ---
const JobStatusBadge: React.FC<{ status: McqImportJobResponse['status'] }> = ({ status }) => {
  const statusMap: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      label: 'Pending',
      icon: <Clock className="w-3 h-3 mr-1" />
    },
    in_progress: {
      color: 'bg-blue-100 text-blue-800 border border-blue-200',
      label: 'In Progress',
      icon: <Clock className="w-3 h-3 mr-1 animate-pulse" />
    },
    completed: {
      color: 'bg-green-100 text-green-800 border border-green-200',
      label: 'Completed',
      icon: <CheckCircle className="w-3 h-3 mr-1" />
    },
    completed_with_errors: {
      color: 'bg-orange-100 text-orange-800 border border-orange-200',
      label: 'Completed with Errors',
      icon: <AlertCircle className="w-3 h-3 mr-1" />
    },
    failed: {
      color: 'bg-red-100 text-red-800 border border-red-200',
      label: 'Failed',
      icon: <AlertCircle className="w-3 h-3 mr-1" />
    },
  };
  const { color, label, icon } = statusMap[status] || statusMap.failed;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {label}
    </span>
  );
};

// --- Main Component ---
interface McqImportManagerProps {
  templateId: string;
  templateTitle: string;
}

const McqImportManager: React.FC<McqImportManagerProps> = ({ templateId, templateTitle }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobs, setJobs] = useState<McqImportJobResponse[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Modal States
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchJobs = useCallback(async () => {
    try {
      const fetchedJobs = await McqImportApi.listJobs(templateId);
      setJobs(fetchedJobs);

      // Check if all jobs are finished to stop polling
      const isAnyJobActive = fetchedJobs.some(
        (job: McqImportJobResponse) => job.status === 'pending' || job.status === 'in_progress'
      );

      if (!isAnyJobActive && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

    } catch (err) {
      console.error('Failed to fetch import jobs:', err);
    }
  }, [templateId]);

  // Initial fetch and start polling
  useEffect(() => {
    fetchJobs();

    // Start polling every 5 seconds if not already running
    if (!intervalRef.current) {
      intervalRef.current = setInterval(fetchJobs, 5000) as unknown as number;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchJobs]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select a CSV or Excel file first.');
      return;
    }

    setIsUploading(true);

    try {
      const result = await McqImportApi.startImport(templateId, file);

      setSuccessMessage(`${result.message}`);
      setFile(null);

      // Force refresh the job list and restart polling
      fetchJobs();
      if (!intervalRef.current) {
        intervalRef.current = setInterval(fetchJobs, 5000) as unknown as number;
      }

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'File upload failed.';
      setErrorMessage(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Bulk MCQ Import
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload a CSV or Excel file to import multiple questions asynchronously.
        </p>
      </div>

      {/* --- File Upload Form --- */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <FileText className="w-8 h-8 text-blue-500" />
          </div>

          <div className="text-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-blue-600 font-medium hover:text-blue-700">Click to upload</span>
              <span className="text-gray-500"> or drag and drop</span>
              <p className="text-xs text-gray-400 mt-1">CSV, Excel (.xlsx, .xls) up to 5MB</p>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>

          {file && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <FileText className="w-4 h-4" />
              {file.name}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || isUploading}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-all
              ${isUploading || !file
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'
              }`}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              'Start Import'
            )}
          </button>
        </div>
      </form>

      {/* --- Job Status Table --- */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          Import History
        </h3>

        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
            No import jobs found for this template.
          </div>
        ) : (
          <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          {job.fileName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <JobStatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="w-full max-w-[140px]">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{Math.round((job.processedRows / job.totalRows) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${job.status === 'failed' ? 'bg-red-500' : 'bg-blue-600'
                                }`}
                              style={{ width: `${(job.processedRows / job.totalRows) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <span className="text-green-600 font-medium">{job.successfulRows} Success</span>
                          {job.failedRows > 0 && (
                            <span className="text-red-500 font-medium">{job.failedRows} Failed</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(job.startedAt || job.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {job.status === 'completed_with_errors' && (
                          <a
                            href={McqImportApi.getDownloadErrorUrl(job.id)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-4 h-4" />
                            Error Log
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- Modals --- */}
      <SuccessModal
        isOpen={!!successMessage}
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />
      <ErrorModal
        isOpen={!!errorMessage}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </div>
  );
};

export default McqImportManager;