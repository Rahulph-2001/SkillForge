import React, { useState, useEffect, useCallback, useRef } from 'react';
import { McqImportApi, McqImportJobResponse } from '../../services/mcqService';

// --- Utility Components ---
const JobStatusBadge: React.FC<{ status: McqImportJobResponse['status'] }> = ({ status }) => {
  const statusMap: Record<string, { color: string; label: string }> = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    in_progress: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
    completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
    completed_with_errors: { color: 'bg-orange-100 text-orange-800', label: 'Done (Errors)' },
    failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
  };
  const { color, label } = statusMap[status] || statusMap.failed;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const intervalRef = useRef<number | null>(null);

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
        setMessage({ type: 'success', text: 'All import jobs finished processing.' });
      }

    } catch (err) {
      console.error('Failed to fetch import jobs:', err);
      setMessage({ type: 'error', text: 'Failed to load job status history.' });
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
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a CSV file first.' });
      return;
    }

    setIsUploading(true);
    setMessage(null);
    try {
      const result = await McqImportApi.startImport(templateId, file);

      setMessage({ type: 'success', text: `${result.message} Job ID: ${result.jobId}` });
      setFile(null);

      // Force refresh the job list and restart polling
      fetchJobs();
      if (!intervalRef.current) {
        intervalRef.current = setInterval(fetchJobs, 5000) as unknown as number;
      }

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'File upload failed.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsUploading(false);
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">
        Bulk MCQ Import for: {templateTitle}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Upload a structured CSV file to import multiple questions asynchronously.
      </p>

      {/* --- File Upload Form --- */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border border-dashed rounded-md bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Question CSV (Max 5MB)
        </label>
        <div className="mt-1 flex justify-between items-center space-x-4">
          <input
            type="file"
            accept=".csv, application/vnd.ms-excel"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
            disabled={isUploading}
          />
          <button
            type="submit"
            disabled={!file || isUploading}
            className={`w-32 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${isUploading || !file ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isUploading ? 'Queuing...' : 'Start Import'}
          </button>
        </div>
        {file && <p className="mt-2 text-sm text-gray-500">Selected: **{file.name}**</p>}
        {message && (
          <div className={`mt-3 p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
            {message.text}
          </div>
        )}
      </form>

      {/* --- Job Status Table --- */}
      <h3 className="text-xl font-semibold mb-3 text-gray-800">Import Job History</h3>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No import jobs found for this template.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success / Failed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className={job.status === 'in_progress' ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.fileName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <JobStatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${(job.processedRows / job.totalRows) * 100}%` }}
                      ></div>
                    </div>
                    <span className="mt-1 block text-xs">
                      {job.processedRows} / {job.totalRows}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-green-600">{job.successfulRows}</span> / <span className="text-red-600">{job.failedRows}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(job.startedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {job.status === 'completed_with_errors' && (
                      <a
                        href={McqImportApi.getDownloadErrorUrl(job.id)}
                        className="text-red-600 hover:text-red-900 ml-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Errors
                      </a>
                    )}
                    {(job.status === 'completed' || job.status === 'completed_with_errors' || job.status === 'failed') && (
                      <span className="text-gray-400 ml-2">{formatDateTime(job.completedAt)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default McqImportManager;