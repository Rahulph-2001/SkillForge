import { useState, useEffect } from 'react';
import {
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    AlertCircle,
    Loader2
} from 'lucide-react';
import adminService, { WithdrawalRequest } from '../../services/adminService';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/common/Pagination';

const AdminWithdrawalManagementPage = () => {
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('PENDING');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
    const [adminNote, setAdminNote] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await adminService.getWithdrawalRequests(page, limit, statusFilter === 'ALL' ? undefined : statusFilter);
            setRequests(response.requests);
            setTotalPages(response.totalPages);
            setTotalItems(response.total);
        } catch (error) {
            console.error('Failed to fetch withdrawal requests:', error);
            toast.error('Failed to load withdrawal requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [page, limit, statusFilter]);

    const handleProcess = async () => {
        if (!selectedRequest || !actionType) return;

        if (actionType === 'APPROVE' && !transactionId) {
            toast.error('Transaction ID is required for approval');
            return;
        }
        if (actionType === 'REJECT' && !adminNote) {
            toast.error('Reason is required for rejection');
            return;
        }

        setProcessingId(selectedRequest.id);
        try {
            await adminService.processWithdrawal(
                selectedRequest.id,
                actionType,
                transactionId,
                adminNote
            );
            toast.success(`Withdrawal ${actionType === 'APPROVE' ? 'approved' : 'rejected'} successfully`);
            setSelectedRequest(null);
            setActionType(null);
            setAdminNote('');
            setTransactionId('');
            fetchRequests();
        } catch (error) {
            console.error('Failed to process withdrawal:', error);
            toast.error('Failed to process withdrawal');
        } finally {
            setProcessingId(null);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            APPROVED: 'bg-green-100 text-green-800',
            PROCESSED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800',
            FAILED: 'bg-red-100 text-red-800',
        };
        const icons = {
            PENDING: Clock,
            APPROVED: CheckCircle,
            PROCESSED: CheckCircle,
            REJECTED: XCircle,
            FAILED: AlertCircle,
        };

        const style = styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
        const Icon = icons[status as keyof typeof icons] || Clock;

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
                <Icon className="w-3.5 h-3.5" />
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h1>
                        <p className="text-gray-600">Manage and process user withdrawal requests</p>
                    </div>
                    {/* Add Conversion Rate Settings Button/Modal here later */}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <div className="flex gap-2">
                            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                            Loading requests...
                                        </td>
                                    </tr>
                                ) : requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No withdrawal requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                            {request.user?.name?.charAt(0) || 'U'}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{request.user?.name || 'Unknown User'}</div>
                                                        <div className="text-sm text-gray-500">{request.user?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">₹{request.amount.toLocaleString('en-IN')}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <p><span className="text-gray-500">Acct:</span> {request.bankDetails?.accountNumber}</p>
                                                    <p><span className="text-gray-500">IFSC:</span> {request.bankDetails?.ifscCode}</p>
                                                    <p><span className="text-gray-500">Bank:</span> {request.bankDetails?.bankName}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={request.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {request.status === 'PENDING' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setActionType('APPROVE');
                                                            }}
                                                            className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setActionType('REJECT');
                                                            }}
                                                            className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {request.status !== 'PENDING' && (
                                                    <span className="text-gray-400">Processed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                limit={limit}
                                onPageChange={setPage}
                                onLimitChange={(newLimit) => {
                                    setLimit(newLimit);
                                    setPage(1);
                                }}
                                showLimitSelector
                                showInfo
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Process Modal */}
            {selectedRequest && actionType && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setSelectedRequest(null)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    {actionType === 'APPROVE' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
                                </h3>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-600"><span className="font-semibold">User:</span> {selectedRequest.user?.name}</p>
                                        <p className="text-sm text-gray-600"><span className="font-semibold">Amount:</span> ₹{selectedRequest.amount}</p>
                                        <p className="text-sm text-gray-600"><span className="font-semibold">Bank:</span> {selectedRequest.bankDetails?.bankName} ({selectedRequest.bankDetails?.accountNumber})</p>
                                    </div>

                                    {actionType === 'APPROVE' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID (from Bank)</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g. TXN12345678"
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {actionType === 'APPROVE' ? 'Admin Notes (Optional)' : 'Rejection Reason'}
                                        </label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                            placeholder={actionType === 'APPROVE' ? 'Any notes for record...' : 'Explain why this request is rejected...'}
                                            value={adminNote}
                                            onChange={(e) => setAdminNote(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    disabled={processingId === selectedRequest.id}
                                    onClick={handleProcess}
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${actionType === 'APPROVE' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                        }`}
                                >
                                    {processingId === selectedRequest.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (actionType === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection')}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => {
                                        setSelectedRequest(null);
                                        setActionType(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWithdrawalManagementPage;
