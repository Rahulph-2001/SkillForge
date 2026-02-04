import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  User,
  Loader2,
  ArrowLeft,
  X,
  CheckCircle,
  CalendarClock,
  Star
} from 'lucide-react';

// import { useAppSelector } from '../../store/hooks';
import { sessionManagementService } from '../../services/sessionManagementService';
import { toast } from 'react-hot-toast';
import RescheduleModal from '../../components/booking/RescheduleModal';
import ConfirmModal from '../../components/common/Modal/ConfirmModal';
import JoinSessionButton from '../../components/session/JoinSessionButton';
import ReviewModal from '../../components/review/ReviewModal';

interface UserSession {
  id: string;
  skillTitle: string;
  providerName: string;
  providerAvatar: string | null;
  preferredDate: string;
  preferredTime: string;
  duration: number;
  sessionType: string;
  status: string;
  notes: string | null;
  rescheduleInfo: any;
  rejectionReason?: string;
  isReviewed?: boolean;
  sessionCost: number;
  createdAt: string;
}

interface SessionStats {
  pending: number;
  confirmed: number;
  rescheduleRequested: number;
  completed: number;
}

type FilterType = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

export default function SessionManagementPage() {
  const navigate = useNavigate();
  // const { user } = useAppSelector((state) => state.auth);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [stats, setStats] = useState<SessionStats>({
    pending: 0,
    confirmed: 0,
    rescheduleRequested: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState<string | null>(null);
  const [sessionToReview, setSessionToReview] = useState<UserSession | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionManagementService.getUserSessions();
      console.log('📊 [SessionManagementPage] Raw data from API:', data);
      console.log('📊 [SessionManagementPage] First session raw:', data.sessions[0]);

      // Map the response to match UserSession interface
      const mappedSessions = data.sessions.map((s: any) => {
        // Explicit extraction with detailed logging
        const provider = s.provider || {};
        const skill = s.skill || {};

        // API returns providerName directly in DTO, or we fallback to provider object
        // NOTE: The backend DTO property is 'providerName', but 'provider' object also has 'name'.
        // We prioritize the provider object's name if available as it comes from the relation.
        const providerName = provider.name || s.providerName || 'Unknown Provider';
        const skillTitle = s.skillTitle || skill.title || 'Unknown Skill';
        const duration = s.duration || (skill.durationHours ? skill.durationHours * 60 : 60);

        console.log('🔍 [SessionManagementPage] Mapping session:', {
          id: s.id,
          status: s.status,
          providerObject: provider,
          providerName: providerName,
          skillObject: skill,
          skillTitle: skillTitle,
          duration,
        });

        return {
          id: s.id,
          skillTitle,
          providerName,
          providerAvatar: s.providerAvatar || s.provider?.avatarUrl || null,
          preferredDate: s.preferredDate,
          preferredTime: s.preferredTime,
          duration,
          sessionType: s.skill?.category || 'Video Call',
          status: s.status,
          notes: s.notes,
          rescheduleInfo: s.rescheduleInfo,
          rejectionReason: s.rejectionReason,
          isReviewed: s.isReviewed,
          sessionCost: s.sessionCost,
          createdAt: s.createdAt,
        };
      });

      console.log('✅ [SessionManagementPage] Mapped sessions:', mappedSessions);
      console.log('✅ [SessionManagementPage] First mapped session:', mappedSessions[0]);
      setSessions(mappedSessions);
      setStats({
        pending: data.stats.pending || 0,
        confirmed: data.stats.confirmed || 0,
        rescheduleRequested: data.stats.rescheduleRequested || 0,
        completed: data.stats.completed || 0,
      });
    } catch (error: any) {
      console.error('❌ [SessionManagementPage] Failed to fetch sessions:', error);
      console.error('❌ [SessionManagementPage] Error response:', error.response);
      toast.error(error.response?.data?.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSession = (sessionId: string) => {
    setSessionToCancel(sessionId);
    setShowCancelConfirm(true);
  };

  const confirmCancelSession = async () => {
    if (!sessionToCancel) return;

    try {
      setActionLoading(sessionToCancel);
      await sessionManagementService.cancelSession(sessionToCancel, 'User requested cancellation');
      toast.success('Session cancelled successfully');
      fetchSessions();
    } catch (error: any) {
      console.error('Failed to cancel session:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel session');
    } finally {
      setActionLoading(null);
      setShowCancelConfirm(false);
      setSessionToCancel(null);
    }
  };

  const handleRescheduleSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setSelectedSession(session);
      setRescheduleModalOpen(true);
    }
  };

  const handleRescheduleSubmit = async (sessionId: string, newDate: string, newTime: string, reason: string) => {
    try {
      await sessionManagementService.rescheduleBooking(sessionId, newDate, newTime, reason);
      toast.success('Reschedule request sent successfully');
      setRescheduleModalOpen(false);
      setSelectedSession(null);
      fetchSessions();
    } catch (error: any) {
      console.error('Failed to reschedule session:', error);
      toast.error(error.response?.data?.message || 'Failed to request reschedule');
      throw error; // Re-throw to let modal handle the error state
    }
  };



  const getFilteredSessions = () => {
    if (activeFilter === 'all') return sessions;
    return sessions.filter((session) => session.status.toLowerCase() === activeFilter);
  };

  const filteredSessions = getFilteredSessions();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
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

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const styles = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      confirmed: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      'reschedule requested': 'bg-orange-100 text-orange-700 border-orange-200',
      in_session: 'bg-purple-100 text-purple-700 border-purple-200 animate-pulse',
    };

    const displayText = statusLower === 'in_session' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[statusLower as keyof typeof styles] || styles.pending
          }`}
      >
        {displayText}
      </span>
    );
  };

  const getInitials = (name: string) => {
    if (!name || name === 'Unknown Provider') return 'UP';
    return name
      .split(' ')
      .filter(n => n.length > 0)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'UP';
  };

  // Helper: Check if session has started or is within 15-minute join window
  const isSessionStarted = (session: any) => {
    if (session.status.toLowerCase() !== 'confirmed') return false;
    const [hours, minutes] = session.preferredTime.split(':').map(Number);
    const sessionStart = new Date(session.preferredDate);
    sessionStart.setHours(hours, minutes, 0, 0);
    const joinWindowStart = new Date(sessionStart.getTime() - 15 * 60 * 1000); // 15 min before
    return new Date() >= joinWindowStart;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-2">Manage and track all your learning sessions</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-amber-900 mt-2">{stats.pending}</p>
              </div>
              <div className="bg-amber-200 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-amber-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Confirmed</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{stats.confirmed}</p>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Reschedule</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">{stats.rescheduleRequested}</p>
              </div>
              <div className="bg-orange-200 p-3 rounded-lg">
                <CalendarClock className="w-6 h-6 text-orange-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.completed}</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeFilter === filter
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                {filter === 'pending' && stats.pending > 0 && (
                  <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {stats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-600">
                {activeFilter === 'all'
                  ? "You haven't booked any sessions yet"
                  : `No ${activeFilter} sessions found`}
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Provider Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {session.providerAvatar ? (
                      <img
                        src={session.providerAvatar}
                        alt={session.providerName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-200">
                        {getInitials(session.providerName)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {session.skillTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <User className="w-4 h-4" />
                        <span>Provider: {session.providerName || 'Unknown'}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(session.preferredDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(session.preferredTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          <span>{session.duration} mins • {session.sessionType}</span>
                        </div>
                      </div>
                      {session.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Notes:</span> {session.notes}
                          </p>
                        </div>
                      )}
                      {session.rescheduleInfo && (
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-700">
                            <span className="font-medium">Reschedule Requested:</span>{' '}
                            {session.rescheduleInfo.reason}
                          </p>
                        </div>
                      )}
                      {session.rejectionReason && (
                        <div className="mt-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded uppercase tracking-wide font-semibold">Reschedule Rejected</span>
                          </div>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium text-red-700">Reason:</span> "{session.rejectionReason}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end gap-4 lg:min-w-[200px]">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(session.status)}
                      <span className="text-lg font-bold text-gray-900">
                        {session.sessionCost} credits
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 justify-end">
                      {(() => {
                        console.log(`🔍 [SessionManagementPage] Session ${session.id} status:`, {
                          original: session.status,
                          lowercase: session.status.toLowerCase(),
                          isPending: session.status.toLowerCase() === 'pending',
                          isConfirmed: session.status.toLowerCase() === 'confirmed',
                        });
                        return null;
                      })()}

                      {session.status.toLowerCase() === 'pending' && (
                        <>
                          <button
                            onClick={() => handleCancelSession(session.id)}
                            disabled={actionLoading === session.id}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                          >
                            {actionLoading === session.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                            Cancel
                          </button>
                        </>
                      )}

                      {session.status.toLowerCase() === 'confirmed' && (
                        isSessionStarted(session) ? (
                          // Session has started - only show Join button
                          <>
                            <JoinSessionButton
                              sessionId={session.id}
                              preferredDate={session.preferredDate}
                              preferredTime={session.preferredTime}
                              duration={session.duration}
                              status={session.status}
                            />
                            <span className="text-xs text-purple-600 text-center font-medium">Session in progress</span>
                          </>
                        ) : (
                          // Session not started - show all buttons
                          <>
                            <JoinSessionButton
                              sessionId={session.id}
                              preferredDate={session.preferredDate}
                              preferredTime={session.preferredTime}
                              duration={session.duration}
                              status={session.status}
                            />
                            <button
                              onClick={() => handleRescheduleSession(session.id)}
                              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                              <CalendarClock className="w-4 h-4" />
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCancelSession(session.id)}
                              disabled={actionLoading === session.id}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                            >
                              {actionLoading === session.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                              Cancel
                            </button>
                          </>
                        )
                      )}

                      {/* IN_SESSION: Only show Join button, no reschedule/cancel */}
                      {session.status.toLowerCase() === 'in_session' && (
                        <JoinSessionButton
                          sessionId={session.id}
                          preferredDate={session.preferredDate}
                          preferredTime={session.preferredTime}
                          duration={session.duration}
                          status={session.status}
                        />
                      )}

                      {session.status.toLowerCase() === 'completed' && !session.isReviewed && (
                        <button
                          onClick={() => {
                            setSessionToReview(session);
                            setShowReviewModal(true);
                          }}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <Star className="w-4 h-4" />
                          Rate & Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        title="Cancel Session"
        message="Are you sure you want to cancel this session? This action cannot be undone."
        confirmText="Yes, Cancel Session"
        cancelText="No, Keep Session"
        type="danger"
        onConfirm={confirmCancelSession}
        onCancel={() => {
          setShowCancelConfirm(false);
          setSessionToCancel(null);
        }}
      />
      {/* Review Modal */}
      {showReviewModal && sessionToReview && (
        <ReviewModal
          bookingId={sessionToReview.id}
          onSubmitted={() => {
            setShowReviewModal(false);
            setSessionToReview(null);
            fetchSessions();
          }}
        />
      )}
    </div>
  );
}
