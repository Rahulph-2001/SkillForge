import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import adminService, { AdminSession, SessionStats } from '../../services/adminService';
import SessionTable from '../../components/admin/session/SessionTable';
import SessionDetailsModal from '../../components/admin/session/SessionDetailsModal';
import ConfirmModal from '../../components/common/Modal/ConfirmModal';
import SuccessModal from '../../components/common/Modal/SuccessModal';
import ErrorModal from '../../components/common/Modal/ErrorModal';
import { usePagination } from '../../hooks/usePagination';

const AdminSessionManagementPage: React.FC = () => {
    const [sessions, setSessions] = useState<AdminSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<SessionStats>({
        totalSessions: 0,
        completed: 0,
        upcoming: 0,
        cancelled: 0
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Modal states
    const [selectedSession, setSelectedSession] = useState<AdminSession | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const {
        page,
        limit,
        goToPage
    } = usePagination({ initialLimit: 10 });

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [page, limit, searchQuery]);

    const fetchStats = async () => {
        try {
            const data = await adminService.getSessionStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch session stats:', error);
        }
    };

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await adminService.listSessions(page, limit, searchQuery);
            setSessions(response.data);
            // Note: usePagination calculates totalPages based on totalItems/limit. 
            // If the backend response provides totalPages, we might need to adjust usePagination to accept it, 
            // or just ensure totalItems logic is correct.
            // Here `usePagination` takes `totalItems` as option, but it's a hook so we might need to update it?
            // Wait, existing usePagination usually takes `totalItems` as a prop or valid dependency?
            // Checking existing `usePagination`: it takes `totalItems` in options. 
            // But since `totalItems` comes from API, we need a way to update it.
            // BUT `usePagination` returns `paginationInfo`. 
            // Wait, `usePagination` implementation shown earlier:
            // `const totalPages = useMemo(() => Math.ceil(totalItems / limit), [totalItems, limit]);`
            // It relies on `totalItems` passed in options. If options change, does it update?
            // Actually, we need to bypass `usePagination`'s internal calculation because `usePagination` might not be reactive to option changes if not handled correctly or if it doesn't expose a setter for totalItems.
            // Let me check usePagination again.
            // It doesn't seem to expose setTotalItems. It uses options.totalItems.
            // So I need to use a slightly different pattern or maybe just manage `totalPages` state locally if the hook doesn't support async totalItems updates well.
            // Actually, I can pass `response.total` to `usePagination` if I re-render? No, hook state is preserved.
            // I will implement a workaround: Calculate totalPages here or assume usePagination needs update.
            // Wait, I can't easily update `totalItems` in `usePagination` hook without re-mounting or if it had a setter.
            // Looking at `usePagination` code again: `const { totalItems = 0 } = options`.
            // It doesn't look like it reacts to options updates unless I key the component or similar.
            // Re-reading `usePagination.ts`: 
            // `const totalPages = useMemo(() => Math.ceil(totalItems / limit), [totalItems, limit]);`
            // If I pass `options` dynamically, does it update?
            // `usePagination(options)` -> `options` is an object.
            // If I call `usePagination({ totalItems: backendTotal })`, on next render it uses new totalItems.
            // So if I have `const [totalItems, setTotalItems] = useState(0)` and pass it to hook, it should work.
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            setErrorMessage('Failed to load sessions.');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    // Workaround for usePagination totalItems:
    const [totalItems, setTotalItems] = useState(0);
    // Overriding usePagination result for totalPages since I control totalItems state
    const calculatedTotalPages = Math.ceil(totalItems / limit);

    // Re-implement fetchSessions to set totalItems
    const fetchSessionsWithTotal = async () => {
        try {
            setLoading(true);
            const response = await adminService.listSessions(page, limit, debouncedSearch);
            setSessions(response.data);
            setTotalItems(response.total);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            setErrorMessage('Failed to load sessions.');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            if (page !== 1) goToPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Use effect to call fetchSessionsWithTotal
    useEffect(() => {
        fetchSessionsWithTotal();
    }, [page, limit, debouncedSearch]);


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (page !== 1) goToPage(1);
    };

    const handleViewDetails = (session: AdminSession) => {
        setSelectedSession(session);
        setShowDetailsModal(true);
    };

    const handleCancelClick = (session: AdminSession) => {
        setSelectedSession(session);
        setCancelReason(''); // Reset reason
        setShowCancelConfirm(true);
    };

    const handleCompleteClick = (session: AdminSession) => {
        setSelectedSession(session);
        setShowCompleteConfirm(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedSession) return;
        setIsProcessing(true);
        try {
            await adminService.cancelSession(selectedSession.id, cancelReason);
            setSuccessMessage('Session cancelled successfully');
            setShowSuccessModal(true);
            setShowCancelConfirm(false);
            fetchStats();
            fetchSessionsWithTotal();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to cancel session');
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmComplete = async () => {
        if (!selectedSession) return;
        setIsProcessing(true);
        try {
            await adminService.completeSession(selectedSession.id);
            setSuccessMessage('Session marked as completed');
            setShowSuccessModal(true);
            setShowCompleteConfirm(false);
            fetchStats();
            fetchSessionsWithTotal();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to complete session');
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/40">
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground">Session Management</h1>
                    <p className="text-muted-foreground mt-1">Monitor and manage all learning sessions</p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by skill or provider..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-foreground placeholder-muted-foreground"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold text-foreground">{stats.totalSessions}</h3>
                    </div>

                    <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Completed</p>
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-foreground">{stats.completed}</h3>
                    </div>

                    <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-foreground">{stats.upcoming}</h3>
                    </div>

                    <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Cancelled</p>
                            <Users className="w-5 h-5 text-destructive" />
                        </div>
                        <h3 className="text-3xl font-bold text-foreground">{stats.cancelled}</h3>
                    </div>
                </div>

                {/* Table */}
                <SessionTable
                    sessions={sessions}
                    loading={loading}
                    currentPage={page}
                    totalPages={calculatedTotalPages}
                    totalItems={totalItems}
                    limit={limit}
                    onPageChange={goToPage}
                    onViewDetails={handleViewDetails}
                    onCancel={handleCancelClick}
                    onComplete={handleCompleteClick}
                />
            </main>

            {/* Modals */}
            <SessionDetailsModal
                session={selectedSession}
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
            />

            <ConfirmModal
                isOpen={showCancelConfirm}
                title="Cancel Session"
                message={`Are you sure you want to cancel this session? This action cannot be undone.`}
                confirmText={isProcessing ? "Cancelling..." : "Confirm Cancellation"}
                cancelText="Close"
                type="danger"
                onConfirm={handleConfirmCancel}
                onCancel={() => setShowCancelConfirm(false)}
            >
                <div className="mt-4">
                    <label className="block text-sm font-medium text-foreground mb-1">Reason for cancellation</label>
                    <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-primary focus:border-primary text-foreground"
                        rows={3}
                        placeholder="Enter reason..."
                    />
                </div>
            </ConfirmModal>

            <ConfirmModal
                isOpen={showCompleteConfirm}
                title="Complete Session"
                message={`Mark session "${selectedSession?.skillTitle}" as completed? This will release funds to the provider.`}
                confirmText={isProcessing ? "Processing..." : "Mark as Complete"}
                cancelText="Cancel"
                type="primary"
                onConfirm={handleConfirmComplete}
                onCancel={() => setShowCompleteConfirm(false)}
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
        </div>
    );
};

export default AdminSessionManagementPage;
