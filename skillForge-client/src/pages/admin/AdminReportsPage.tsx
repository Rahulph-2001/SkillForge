import { useState, useEffect } from 'react';
import {
    Layout,
    Filter,
    Search,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    MessageSquare,
    ChevronRight
} from 'lucide-react';
import adminService, { Report, ReportFilters } from '../../services/adminService';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<ReportFilters>({});
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [resolutionNote, setResolutionNote] = useState('');
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
    const [actionType, setActionType] = useState<'RESOLVE' | 'DISMISS' | null>(null);

    useEffect(() => {
        fetchReports();
    }, [filters]);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.listReports(1, 100, filters);
            setReports(response.reports);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
            toast.error('Failed to load reports');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = (report: Report, action: 'RESOLVE' | 'DISMISS') => {
        setSelectedReport(report);
        setActionType(action);
        setResolutionNote('');
        setIsResolveModalOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedReport || !actionType) return;

        try {
            await adminService.updateReport(selectedReport.id, actionType, resolutionNote);
            toast.success(`Report ${actionType === 'RESOLVE' ? 'resolved' : 'dismissed'} successfully`);
            setIsResolveModalOpen(false);
            fetchReports();
        } catch (error) {
            console.error('Failed to update report:', error);
            toast.error('Failed to update report status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports & Disputes</h1>
                    <p className="text-gray-600 mt-1">Manage user reports and project disputes</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="REVIEWING">Reviewing</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="DISMISSED">Dismissed</option>
                    </select>

                    <select
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
                    >
                        <option value="">All Types</option>
                        <option value="PROJECT_DISPUTE">Project Disputes</option>
                        <option value="USER_REPORT">User Reports</option>
                        <option value="COMMUNITY_CONTENT">Community Content</option>
                    </select>
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <CheckCircle className="w-12 h-12 text-green-100 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                        <p>No active reports found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Reporter</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type / Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {report.reporter ? (
                                                    <>
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                            {report.reporter.name?.charAt(0) || '?'}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{report.reporter.name || 'Unknown User'}</p>
                                                            <p className="text-xs text-gray-500">{report.reporter.email || 'No email'}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                                                            ?
                                                        </div>
                                                        <span className="text-sm italic">Unknown Reporter</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {report.type ? report.type.replace('_', ' ') : 'Unknown Type'}
                                                </span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                                                    {report.category || 'Uncategorized'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                                                {report.projectId && (
                                                    <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                                                        <Layout className="w-3 h-3" />
                                                        Project ID: {report.projectId.slice(0, 8)}...
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${report.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                                    report.status === 'REVIEWING' ? 'bg-blue-100 text-blue-800' :
                                                        report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                {report.status}
                                            </span>
                                            {report.createdAt && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {format(new Date(report.createdAt), 'MMM d, yyyy')}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {report.status !== 'RESOLVED' && report.status !== 'DISMISSED' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction(report, 'DISMISS')}
                                                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                                        title="Dismiss"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(report, 'RESOLVE')}
                                                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                                                        title="Resolve"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Resolution Modal */}
            {isResolveModalOpen && selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {actionType === 'RESOLVE' ? 'Resolve Report' : 'Dismiss Report'}
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="text-xs text-gray-500 mb-1">Report Description:</p>
                                <p className="text-sm text-gray-700 italic">"{selectedReport.description}"</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {actionType === 'RESOLVE' ? 'Resolution Details (Required)' : 'Dismissal Reason (Optional)'}
                                </label>
                                <textarea
                                    value={resolutionNote}
                                    onChange={(e) => setResolutionNote(e.target.value)}
                                    placeholder={actionType === 'RESOLVE' ? "Explain the resolution and any actions taken..." : "Why is this report being dismissed?"}
                                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                                />
                            </div>

                            {actionType === 'RESOLVE' && selectedReport.type === 'PROJECT_DISPUTE' && (
                                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-amber-800 text-xs mb-4">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p>
                                        Resolving a project dispute does not automatically process payments.
                                        Please go to the <b>Projects</b> tab to use the "Override" feature for fund allocation if needed.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => setIsResolveModalOpen(false)}
                                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction}
                                disabled={actionType === 'RESOLVE' && !resolutionNote.trim()}
                                className={`px-4 py-2 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                    ${actionType === 'RESOLVE' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                            >
                                Confirm {actionType === 'RESOLVE' ? 'Resolution' : 'Dismissal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
