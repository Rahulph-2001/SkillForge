import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  BookmarkIcon,
  Check,
  X,
  AlertCircle,
  ArrowRight,
  Loader2,
  Users,
  BookOpen,
  CalendarClock,
} from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// import { useAppSelector } from '../../store/hooks';
import { sessionManagementService, SessionStats } from '../../services/sessionManagementService';
import { toast } from 'react-hot-toast';
import RescheduleModal from '../../components/booking/RescheduleModal';

import ConfirmModal from '../../components/common/Modal/ConfirmModal';
import PromptModal from '../../components/common/Modal/PromptModal';
import JoinSessionButton from '../../components/session/JoinSessionButton';

type FilterType = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
type ViewMode = 'learner' | 'provider';

export default function SessionManagementPage() {
  // const { user } = useAppSelector((state) => state.auth);
  const [viewMode, setViewMode] = useState<ViewMode>('learner');
  const [sessions, setSessions] = useState<any[]>([]); // Changed to any to support both provider/learner session types
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);

  // Modal States
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const [promptModal, setPromptModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: (_value: string) => { }, // eslint-disable-line @typescript-eslint/no-unused-vars
  });
  // const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, [viewMode]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = viewMode === 'provider'
        ? await sessionManagementService.getProviderSessions()
        : await sessionManagementService.getUserSessions();

      // Handle empty or undefined data gracefully
      let mappedSessions = data?.sessions || [];

      // If in learner mode, map provider details to be accessible
      if (viewMode === 'learner') {
        mappedSessions = mappedSessions.map((s: any) => ({
          ...s,
          // Improved provider name extraction
          providerName: s.providerName || s.provider?.name || 'Unknown Provider',
          providerAvatar: s.providerAvatar || s.provider?.avatarUrl || null,
          skillTitle: s.skill?.title || s.skillTitle || 'Unknown Skill',
          duration: s.skill?.durationHours ? s.skill.durationHours * 60 : 60,
          sessionType: s.skill?.category || 'Video Call',
          rejectionReason: s.rejectionReason, // Explicitly pass this through
        }));
      }

      setSessions(mappedSessions);
      setStats(data?.stats || { pending: 0, confirmed: 0, rescheduleRequested: 0, completed: 0 });
    } catch (error: any) {
      console.error('Failed to fetch sessions:', error);
      // Set empty data on error
      setSessions([]);
      setStats({ pending: 0, confirmed: 0, rescheduleRequested: 0, completed: 0 });

      // Only show error toast if it's not a "no skills" scenario
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || 'Failed to load sessions');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return session.status === 'pending';
    if (activeFilter === 'Confirmed') return session.status === 'confirmed' || session.status === 'in_session';
    if (activeFilter === 'Completed') return session.status === 'completed';
    if (activeFilter === 'Cancelled') return session.status === 'cancelled';
    return true;
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'confirmed':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'in_session':
        return 'bg-purple-50 text-purple-700 border border-purple-200 animate-pulse';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'reschedule_requested':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      await sessionManagementService.acceptBooking(bookingId);
      toast.success('Booking accepted successfully');
      await fetchSessions();
    } catch (error: any) {
      console.error('Failed to accept booking:', error);
      toast.error(error.response?.data?.message || 'Failed to accept booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineBooking = (bookingId: string) => {
    setPromptModal({
      isOpen: true,
      title: 'Decline Booking',
      message: 'Please provide a reason for declining this booking:',
      onConfirm: async (reason) => {
        try {
          setActionLoading(bookingId);
          await sessionManagementService.declineBooking(bookingId, reason);
          toast.success('Booking declined successfully');
          await fetchSessions();
        } catch (error: any) {
          console.error('Failed to decline booking:', error);
          toast.error(error.response?.data?.message || 'Failed to decline booking');
        } finally {
          setActionLoading(null);
          setPromptModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleCancelSession = (bookingId: string) => {
    setPromptModal({
      isOpen: true,
      title: 'Cancel Session',
      message: 'Please provide a reason for cancellation:',
      onConfirm: async (reason) => {
        try {
          setActionLoading(bookingId);
          await sessionManagementService.cancelSession(bookingId, reason);
          toast.success('Session cancelled successfully');
          await fetchSessions();
        } catch (error: any) {
          console.error('Failed to cancel session:', error);
          toast.error(error.response?.data?.message || 'Failed to cancel session');
        } finally {
          setActionLoading(null);
          setPromptModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleAcceptReschedule = (bookingId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Accept Reschedule',
      message: 'Are you sure you want to accept this reschedule request?',
      onConfirm: async () => {
        try {
          setActionLoading(bookingId);
          await sessionManagementService.acceptReschedule(bookingId);
          toast.success('Reschedule request accepted successfully');
          await fetchSessions();
        } catch (error: any) {
          console.error('Failed to accept reschedule:', error);
          toast.error(error.response?.data?.message || 'Failed to accept reschedule');
        } finally {
          setActionLoading(null);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleDeclineReschedule = (bookingId: string) => {
    setPromptModal({
      isOpen: true,
      title: 'Decline Reschedule',
      message: 'Please provide a reason for declining the reschedule:',
      onConfirm: async (reason) => {
        try {
          setActionLoading(bookingId);
          await sessionManagementService.declineReschedule(bookingId, reason);
          toast.success('Reschedule request declined');
          await fetchSessions();
        } catch (error: any) {
          console.error('Failed to decline reschedule:', error);
          toast.error(error.response?.data?.message || 'Failed to decline reschedule');
        } finally {
          setActionLoading(null);
          setPromptModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleRescheduleSession = (session: any) => {
    setSelectedSession(session);
    setRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (sessionId: string, newDate: string, newTime: string, reason: string) => {
    try {
      await sessionManagementService.rescheduleBooking(sessionId, newDate, newTime, reason);
      toast.success('Reschedule request sent successfully');
      setRescheduleModalOpen(false);
      setSelectedSession(null);
      await fetchSessions();
    } catch (error: any) {
      console.error('Failed to reschedule session:', error);
      toast.error(error.response?.data?.message || 'Failed to request reschedule');
      throw error;
    }
  };

  const renderSessionActions = (session: any) => {
    const isLoading = actionLoading === session.id;

    // Helper: Check if session has started or is within 15-minute join window
    const isSessionStarted = () => {
      if (session.status !== 'confirmed') return false;
      const [hours, minutes] = session.preferredTime.split(':').map(Number);
      const sessionStart = new Date(session.preferredDate);
      sessionStart.setHours(hours, minutes, 0, 0);
      const joinWindowStart = new Date(sessionStart.getTime() - 15 * 60 * 1000); // 15 min before
      return new Date() >= joinWindowStart;
    };

    // In learner mode, show different actions
    if (viewMode === 'learner') {
      if (session.status === 'pending') {
        return (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleCancelSession(session.id)}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 border border-red-200 hover:bg-red-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              Cancel Request
            </button>
          </div>
        );
      }

      // For confirmed sessions, check if session time window has started
      if (session.status === 'confirmed') {
        const sessionInProgress = isSessionStarted();

        // If session has started or is about to start, only show Join button
        if (sessionInProgress) {
          return (
            <div className="flex flex-col gap-2">
              <JoinSessionButton
                sessionId={session.id}
                preferredDate={session.preferredDate}
                preferredTime={session.preferredTime}
                duration={session.duration}
                status={session.status}
                className="w-full"
              />
              <span className="text-xs text-purple-600 text-center font-medium">Session in progress</span>
            </div>
          );
        }

        // Session not started yet - show all buttons
        return (
          <div className="flex flex-col gap-2">
            <JoinSessionButton
              sessionId={session.id}
              preferredDate={session.preferredDate}
              preferredTime={session.preferredTime}
              duration={session.duration}
              status={session.status}
              className="w-full"
            />
            <button
              onClick={() => handleRescheduleSession(session)}
              className="flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700 px-4 py-2 rounded-lg text-sm font-medium transition border border-orange-200 hover:bg-orange-50"
            >
              <CalendarClock className="w-4 h-4" />
              Reschedule
            </button>
            <button
              onClick={() => handleCancelSession(session.id)}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 border border-red-200 hover:bg-red-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              Cancel
            </button>
          </div>
        );
      }
      // IN_SESSION: Only show Join button - NO cancel/reschedule allowed
      if (session.status === 'in_session') {
        return (
          <div className="flex flex-col gap-2">
            <JoinSessionButton
              sessionId={session.id}
              preferredDate={session.preferredDate}
              preferredTime={session.preferredTime}
              duration={session.duration}
              status={session.status}
              className="w-full"
            />
            <span className="text-xs text-purple-600 text-center font-medium">Session in progress</span>
          </div>
        );
      }
      return null;
    }

    // Provider mode actions
    if (session.status === 'pending') {
      return (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleAcceptBooking(session.id)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Accept
          </button>
          <button
            onClick={() => handleDeclineBooking(session.id)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Decline
          </button>
        </div>
      );
    }

    if (session.status === 'confirmed') {
      const sessionInProgress = isSessionStarted();

      // If session has started, only show Join button (no Cancel for provider either)
      if (sessionInProgress) {
        return (
          <div className="flex flex-col gap-2">
            <JoinSessionButton
              sessionId={session.id}
              preferredDate={session.preferredDate}
              preferredTime={session.preferredTime}
              duration={session.duration}
              status={session.status}
              className="w-full"
            />
            <span className="text-xs text-purple-600 text-center font-medium">Session in progress</span>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-2">
          <JoinSessionButton
            sessionId={session.id}
            preferredDate={session.preferredDate}
            preferredTime={session.preferredTime}
            duration={session.duration}
            status={session.status}
            className="w-full"
          />
          <button
            onClick={() => handleCancelSession(session.id)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            Cancel
          </button>
        </div>
      );
    }

    if (session.status === 'reschedule_requested') {
      return (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleAcceptReschedule(session.id)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Accept
          </button>
          <button
            onClick={() => handleDeclineReschedule(session.id)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            Decline
          </button>
        </div>
      );
    }

    // IN_SESSION: Only show Join button, no cancel
    if (session.status === 'in_session') {
      return (
        <div className="flex flex-col gap-2">
          <JoinSessionButton
            sessionId={session.id}
            preferredDate={session.preferredDate}
            preferredTime={session.preferredTime}
            duration={session.duration}
            status={session.status}
            className="w-full"
          />
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="flex flex-col justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Session Management</h1>
              <p className="text-gray-600 text-sm mt-1">Manage all your bookings and session requests</p>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setViewMode('learner')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${viewMode === 'learner'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <BookOpen className="w-5 h-5" />
              My Bookings
              <span className="text-xs opacity-75">(As Learner)</span>
            </button>
            <button
              onClick={() => setViewMode('provider')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${viewMode === 'provider'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Users className="w-5 h-5" />
              Provider Sessions
              <span className="text-xs opacity-75">(As Provider)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-4 gap-6">
              {/* Pending */}
              <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-amber-600 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
              </div>

              {/* Confirmed */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Confirmed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.confirmed}</p>
                  </div>
                  <Check className="w-8 h-8 text-green-500" />
                </div>
              </div>

              {/* Reschedule */}
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Reschedule</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.reschedule}</p>
                  </div>
                  <ArrowRight className="w-8 h-8 text-orange-500" />
                </div>
              </div>

              {/* Completed */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
                  </div>
                  <Check className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-4">
            {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeFilter === filter ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                  } relative`}
              >
                {filter}
                {filter === 'Pending' && activeFilter === filter && stats && stats.pending > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredSessions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {viewMode === 'provider' ? 'No Booking Requests' : 'No Bookings Yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {viewMode === 'provider' ? (
                activeFilter === 'All'
                  ? "You haven't received any booking requests yet. Add skills to start receiving requests!"
                  : activeFilter === 'Pending'
                    ? "You don't have any pending booking requests."
                    : activeFilter === 'Confirmed'
                      ? "You don't have any confirmed sessions."
                      : activeFilter === 'Completed'
                        ? "You haven't completed any sessions yet."
                        : "You don't have any cancelled sessions."
              ) : (
                activeFilter === 'All'
                  ? "You haven't booked any sessions yet. Browse skills to get started!"
                  : activeFilter === 'Pending'
                    ? "You don't have any pending bookings."
                    : activeFilter === 'Confirmed'
                      ? "You don't have any confirmed sessions."
                      : activeFilter === 'Completed'
                        ? "You haven't completed any sessions yet."
                        : "You don't have any cancelled bookings."
              )}
            </p>
            {viewMode === 'provider' && activeFilter === 'All' && (
              <button
                onClick={() => window.location.href = '/my-skills'}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                <BookmarkIcon className="w-5 h-5" />
                Add Your Skills
              </button>
            )}
            {viewMode === 'learner' && activeFilter === 'All' && (
              <button
                onClick={() => window.location.href = '/explore'}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                <BookOpen className="w-5 h-5" />
                Browse Skills
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                      {viewMode === 'learner' ? (
                        session.providerAvatar ? (
                          <img
                            src={session.providerAvatar}
                            alt={session.providerName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-white">{getInitials(session.providerName)}</span>
                        )
                      ) : (
                        session.learnerAvatar ? (
                          <img
                            src={session.learnerAvatar}
                            alt={session.learnerName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-white">{getInitials(session.learnerName)}</span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{session.skillTitle}</h3>
                        <div className="flex items-center gap-1 mt-1 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="text-sm">
                            {viewMode === 'learner'
                              ? `with ${session.providerName}`
                              : `with ${session.learnerName}`}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(session.status)}`}>
                        {session.status === 'in_session'
                          ? 'In Progress'
                          : session.status.charAt(0).toUpperCase() + session.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(session.preferredDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatTime(session.preferredTime)} ({session.duration || 60} min)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{session.sessionType || 'Virtual'}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {session.notes && (
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Notes:</span> {session.notes}
                      </p>
                    )}

                    {/* Reschedule Info */}
                    {session.rescheduleInfo && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold text-orange-900">Reschedule Request</p>
                            <p className="text-orange-700 mt-1">
                              New date: {formatDate(session.rescheduleInfo.newDate)} at{' '}
                              {formatTime(session.rescheduleInfo.newTime)}
                            </p>
                            <p className="text-orange-600 text-xs mt-1">Reason: {session.rescheduleInfo.reason}</p>
                            <p className="text-orange-600 text-xs">Requested by {session.rescheduleInfo.requestedBy}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rejection Reason Display */}
                    {session.rejectionReason && (
                      <div className="mt-4 p-4 bg-red-50 rounded-lg border-2 border-red-200 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded uppercase tracking-wide font-semibold">Reschedule Rejected</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-red-700">Reason:</span> "{session.rejectionReason}"
                        </p>
                      </div>
                    )}

                    {/* Credits */}
                    <div className="flex items-center gap-1 text-sm">
                      <BookmarkIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{session.sessionCost} credits</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 w-32">{renderSessionActions(session)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {selectedSession && (
        <RescheduleModal
          isOpen={rescheduleModalOpen}
          onClose={() => {
            setRescheduleModalOpen(false);
            setSelectedSession(null);
          }}
          sessionId={selectedSession.id}
          currentDate={selectedSession.preferredDate}
          currentTime={selectedSession.preferredTime}
          skillTitle={selectedSession.skillTitle}
          onReschedule={handleRescheduleSubmit}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Prompt Modal */}
      <PromptModal
        isOpen={promptModal.isOpen}
        title={promptModal.title}
        message={promptModal.message}
        onConfirm={promptModal.onConfirm}
        onCancel={() => setPromptModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
