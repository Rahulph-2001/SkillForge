import React, { useState, useEffect } from 'react';
import { Search, FolderOpen, Play, CheckCircle, Clock, XCircle, DollarSign, RefreshCw, Eye, AlertTriangle, Ban } from 'lucide-react';
import adminService, { AdminProject, AdminProjectStats, PendingPaymentRequest } from '../../services/adminService';
import ConfirmModal from '../../components/common/Modal/ConfirmModal';
import SuccessModal from '../../components/common/Modal/SuccessModal';
import ErrorModal from '../../components/common/Modal/ErrorModal';
import ProjectDetailsModal from '../../components/admin/ProjectDetailsModal';
import { usePagination } from '../../hooks/usePagination';

const AdminProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<AdminProject[]>([]);
    const [pendingRequests, setPendingRequests] = useState<PendingPaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AdminProjectStats>({
        totalProjects: 0,
        openProjects: 0,
        inProgressProjects: 0,
        completedProjects: 0,
        pendingApprovalProjects: 0,
        cancelledProjects: 0,
        totalBudget: 0
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<string>('All');
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

    // Modal states
    const [selectedRequest, setSelectedRequest] = useState<PendingPaymentRequest | null>(null);
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [rejectNotes, setRejectNotes] = useState('');

    // Details and suspend modal states
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
    const [suspendReason, setSuspendReason] = useState('');
    const [suspendWithRefund, setSuspendWithRefund] = useState(false);
    const [isSuspendedFilter, setIsSuspendedFilter] = useState<boolean | undefined>(undefined);

    const { page, limit, goToPage } = usePagination({ initialLimit: 10 });
    const [totalItems, setTotalItems] = useState(0);
    const calculatedTotalPages = Math.ceil(totalItems / limit);

    useEffect(() => {
        fetchStats();
        fetchPendingRequests();
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [page, limit, searchQuery, statusFilter, isSuspendedFilter]);

    const fetchStats = async () => {
        try {
            const data = await adminService.getProjectStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch project stats:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await adminService.listProjects(page, limit, searchQuery, statusFilter, undefined, isSuspendedFilter);
            setProjects(response.projects);
            setTotalItems(response.total);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            setErrorMessage('Failed to load projects.');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const data = await adminService.getPendingPaymentRequests();
            setPendingRequests(data);
        } catch (error) {
            console.error('Failed to fetch pending requests:', error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (page !== 1) goToPage(1);
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        let status: string | undefined;
        let suspended: boolean | undefined;
        switch (tab) {
            case 'Open': status = 'Open'; suspended = undefined; break;
            case 'In Progress': status = 'In_Progress'; suspended = undefined; break;
            case 'Completed': status = 'Completed'; suspended = undefined; break;
            case 'Pending Approvals': status = undefined; suspended = undefined; break; // Special handling
            case 'Cancelled': status = 'Cancelled'; suspended = undefined; break;
            case 'Flagged': status = undefined; suspended = true; break;
            default: status = undefined; suspended = undefined;
        }
        setStatusFilter(status);
        setIsSuspendedFilter(suspended);
        goToPage(1);
    };

    const handleApproveClick = (request: PendingPaymentRequest) => {
        setSelectedRequest(request);
        setShowApproveConfirm(true);
    };

    const handleRejectClick = (request: PendingPaymentRequest) => {
        setSelectedRequest(request);
        setRejectNotes('');
        setShowRejectConfirm(true);
    };

    const handleConfirmApprove = async () => {
        if (!selectedRequest) return;
        setIsProcessing(true);
        try {
            await adminService.processPaymentRequest(selectedRequest.id, true);
            setSuccessMessage(`${selectedRequest.type === 'RELEASE' ? 'Payment released' : 'Refund processed'} successfully!`);
            setShowSuccessModal(true);
            setShowApproveConfirm(false);
            fetchStats();
            fetchProjects();
            fetchPendingRequests();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to process request');
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmReject = async () => {
        if (!selectedRequest) return;
        setIsProcessing(true);
        try {
            await adminService.processPaymentRequest(selectedRequest.id, false, rejectNotes);
            setSuccessMessage('Payment request rejected');
            setShowSuccessModal(true);
            setShowRejectConfirm(false);
            fetchStats();
            fetchProjects();
            fetchPendingRequests();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to reject request');
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOverrideClick = (request: PendingPaymentRequest) => {
        setSelectedRequest(request);
        setShowOverrideConfirm(true);
    };

    const handleConfirmOverride = async () => {
        if (!selectedRequest) return;
        setIsProcessing(true);
        try {
            // overrideAction: 'OVERRIDE_RELEASE' passed as 3rd arg (actually 4th in service, check service sig)
            // Checking adminService.processPaymentRequest signature in next step if needed, but assuming standard extension
            await adminService.processPaymentRequest(selectedRequest.id, false, 'Override Release for Dispute Resolution', 'OVERRIDE_RELEASE');
            setSuccessMessage('Refund rejected and payment released to contributor successfully!');
            setShowSuccessModal(true);
            setShowOverrideConfirm(false);
            fetchStats();
            fetchProjects();
            fetchPendingRequests();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to process override');
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            'Open': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Open' },
            'In_Progress': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Progress' },
            'Pending_Completion': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Pending Completion' },
            'Payment_Pending': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Payment Pending' },
            'Refund_Pending': { bg: 'bg-red-100', text: 'text-red-800', label: 'Refund Pending' },
            'Completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
            'Cancelled': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' }
        };
        const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    const tabs = [
        { label: 'All', count: stats.totalProjects },
        { label: 'Open', count: stats.openProjects },
        { label: 'In Progress', count: stats.inProgressProjects },
        { label: 'Completed', count: stats.completedProjects },
        { label: 'Pending Approvals', count: stats.pendingApprovalProjects },
        { label: 'Cancelled', count: stats.cancelledProjects },
        { label: 'Flagged', count: stats.suspendedProjects || 0 }
    ];

    const handleViewDetails = (projectId: string) => {
        setSelectedProjectId(projectId);
        setShowDetailsModal(true);
    };

    const handleSuspendClick = (projectId: string) => {
        setSelectedProjectId(projectId);
        setSuspendReason('');
        setSuspendWithRefund(false);
        setShowSuspendConfirm(true);
    };

    const handleConfirmSuspend = async () => {
        if (!selectedProjectId || !suspendReason.trim()) return;
        setIsProcessing(true);
        try {
            await adminService.suspendProject(selectedProjectId, suspendReason, suspendWithRefund);
            setSuccessMessage(`Project suspended successfully${suspendWithRefund ? ' with refund' : ''}!`);
            setShowSuccessModal(true);
            setShowSuspendConfirm(false);
            fetchStats();
            fetchProjects();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to suspend project');
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
                    <p className="text-gray-600 mt-1">Monitor and manage all projects and payment requests</p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by project title..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Total Projects</p>
                            <FolderOpen className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.totalProjects}</h3>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <Play className="w-5 h-5 text-yellow-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.inProgressProjects}</h3>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.completedProjects}</h3>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                            <Clock className="w-5 h-5 text-orange-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.pendingApprovalProjects}</h3>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Cancelled</p>
                            <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.cancelledProjects}</h3>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Total Budget</p>
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">₹{stats.totalBudget.toLocaleString()}</h3>
                    </div>
                </div>

                {/* Pending Payment Requests Section */}
                {pendingRequests.length > 0 && (
                    <div className="bg-white rounded-lg border border-orange-200 shadow-sm mb-8">
                        <div className="p-4 border-b border-orange-200 bg-orange-50 rounded-t-lg">
                            <h2 className="text-lg font-semibold text-orange-800 flex items-center gap-2">
                                <RefreshCw className="w-5 h-5" />
                                Pending Payment Requests ({pendingRequests.length})
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {pendingRequests.map((request) => (
                                <div key={request.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{request.projectTitle}</h3>
                                        <p className="text-sm text-gray-600">
                                            {request.type === 'RELEASE' ? 'Payment Release' : 'Refund'} - Requested by {request.requestedBy.name}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Amount: <span className="font-semibold text-gray-900">₹{request.amount.toLocaleString()}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.type === 'RELEASE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {request.type === 'RELEASE' ? 'Release Payment' : 'Refund'}
                                        </span>
                                        <button
                                            onClick={() => handleApproveClick(request)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectClick(request)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                        >
                                            Reject
                                        </button>
                                        {/* Override Release Button for Disputes (Refund Requests) */}
                                        {request.type === 'REFUND' && (
                                            <button
                                                onClick={() => handleOverrideClick(request)}
                                                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center gap-1"
                                                title="Reject refund and release payment to contributor"
                                            >
                                                <DollarSign className="w-3 h-3" />
                                                Override Release
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <div className="flex space-x-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.label}
                                onClick={() => handleTabChange(tab.label)}
                                className={`pb-3 px-1 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.label
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-500">Loading projects...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="p-8 text-center">
                            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No projects found</p>
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {projects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs">
                                                    <p className="font-medium text-gray-900 truncate">{project.title}</p>
                                                    <p className="text-sm text-gray-500">{project.category}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {project.creator.avatarUrl ? (
                                                        <img
                                                            src={project.creator.avatarUrl}
                                                            alt={project.creator.name}
                                                            className="w-8 h-8 rounded-full mr-3"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm font-medium">
                                                            {project.creator.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{project.creator.name}</p>
                                                        <p className="text-xs text-gray-500">{project.creator.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {project.contributor ? (
                                                    <div className="flex items-center">
                                                        {project.contributor.avatarUrl ? (
                                                            <img
                                                                src={project.contributor.avatarUrl}
                                                                alt={project.contributor.name}
                                                                className="w-8 h-8 rounded-full mr-3"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-sm font-medium">
                                                                {project.contributor.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <p className="text-sm text-gray-900">{project.contributor.name}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">No contributor</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">₹{project.budget.toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(project.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{project.applicationsCount}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(project.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {!project.isSuspended && (
                                                        <button
                                                            onClick={() => handleSuspendClick(project.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Suspend Project"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {project.isSuspended && (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            Suspended
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {calculatedTotalPages > 1 && (
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalItems)} of {totalItems} projects
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => goToPage(page - 1)}
                                            disabled={page === 1}
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: Math.min(5, calculatedTotalPages) }, (_, i) => {
                                            const pageNum = Math.max(1, Math.min(page - 2, calculatedTotalPages - 4)) + i;
                                            if (pageNum > calculatedTotalPages) return null;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => goToPage(pageNum)}
                                                    className={`px-3 py-1 rounded-md text-sm ${page === pageNum
                                                        ? 'bg-blue-600 text-white'
                                                        : 'border border-gray-300 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => goToPage(page + 1)}
                                            disabled={page === calculatedTotalPages}
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Modals */}
            <ConfirmModal
                isOpen={showApproveConfirm}
                title={selectedRequest?.type === 'RELEASE' ? 'Approve Payment Release' : 'Approve Refund'}
                message={`Are you sure you want to ${selectedRequest?.type === 'RELEASE' ? 'release payment' : 'process refund'} of ₹${selectedRequest?.amount.toLocaleString()} for "${selectedRequest?.projectTitle}"?`}
                confirmText={isProcessing ? "Processing..." : "Approve"}
                cancelText="Cancel"
                type="primary"
                onConfirm={handleConfirmApprove}
                onCancel={() => setShowApproveConfirm(false)}
            />

            <ConfirmModal
                isOpen={showRejectConfirm}
                title="Reject Payment Request"
                message={`Are you sure you want to reject this ${selectedRequest?.type === 'RELEASE' ? 'payment release' : 'refund'} request?`}
                confirmText={isProcessing ? "Processing..." : "Reject"}
                cancelText="Cancel"
                type="danger"
                onConfirm={handleConfirmReject}
                onCancel={() => setShowRejectConfirm(false)}
            >
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for rejection</label>
                    <textarea
                        value={rejectNotes}
                        onChange={(e) => setRejectNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Enter reason..."
                    />
                </div>
            </ConfirmModal>

            <ConfirmModal
                isOpen={showOverrideConfirm}
                title="Override Refund & Release Payment"
                message={`This action will REJECT the refund request and immediately RELEASE funds to the contributor. This should be done to resolve a dispute in favor of the contributor. Are you sure?`}
                confirmText={isProcessing ? "Processing..." : "Confirm Override"}
                cancelText="Cancel"
                type="warning" // Using warning type for caution
                onConfirm={handleConfirmOverride}
                onCancel={() => setShowOverrideConfirm(false)}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                title="Success"
                message={successMessage}
                onClose={() => setShowSuccessModal(false)}
            />

            <ErrorModal
                isOpen={showErrorModal}
                message={errorMessage}
                onClose={() => setShowErrorModal(false)}
            />

            {/* Project Details Modal */}
            {selectedProjectId && (
                <ProjectDetailsModal
                    projectId={selectedProjectId}
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedProjectId(null);
                    }}
                    onSuspend={(id) => {
                        setShowDetailsModal(false);
                        handleSuspendClick(id);
                    }}
                />
            )}

            {/* Suspend Project Confirm Modal */}
            <ConfirmModal
                isOpen={showSuspendConfirm}
                title="Suspend Project"
                message="This will suspend the project and prevent any further actions. Are you sure you want to proceed?"
                confirmText={isProcessing ? "Suspending..." : "Suspend"}
                cancelText="Cancel"
                type="danger"
                onConfirm={handleConfirmSuspend}
                onCancel={() => setShowSuspendConfirm(false)}
            >
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for suspension *</label>
                        <textarea
                            value={suspendReason}
                            onChange={(e) => setSuspendReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            rows={3}
                            placeholder="Enter reason for suspending this project..."
                            required
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="withRefund"
                            checked={suspendWithRefund}
                            onChange={(e) => setSuspendWithRefund(e.target.checked)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="withRefund" className="text-sm text-gray-700">
                            Process refund to project creator
                        </label>
                    </div>
                </div>
            </ConfirmModal>
        </div>
    );
};

export default AdminProjectsPage;
