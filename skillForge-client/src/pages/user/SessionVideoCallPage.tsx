import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import VideoCallRoom from '../../components/video/VideoCallRoom';
import ReviewModal from '../../components/review/ReviewModal';
import { VideoCallStrategyFactory } from '../../services/VideoCallStrategyFactory';
import { videoCallService, VideoCallRoom as IVideoCallRoom, SessionInfo } from '../../services/videoCallService';
import { useAppSelector } from '../../store/hooks';

export default function SessionVideoCallPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const [room, setRoom] = useState<IVideoCallRoom | null>(null);
    const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        if (!bookingId || !user) return;

        const initBooking = async () => {
            try {
                setLoading(true);
                const strategy = VideoCallStrategyFactory.getStrategy('booking');

                // Parallel fetch
                const [roomData, sessionData] = await Promise.all([
                    strategy.getRoom(bookingId),
                    strategy.getSessionInfo(bookingId)
                ]);

                // Validate time
                const validation = await strategy.validateTime(bookingId);
                if (validation && !validation.canJoin) {
                    setError(validation.message);
                    setLoading(false);
                    return;
                }

                setRoom(roomData);
                setSessionInfo(sessionData);
            } catch (err: any) {
                console.error('Failed to join booking session:', err);
                setError(err.response?.data?.error || err.message || 'Failed to join video call');
            } finally {
                setLoading(false);
            }
        };

        initBooking();
    }, [bookingId, user]);

    const handleSessionEnd = async () => {
        if (!room || !sessionInfo || !user) return;

        try {
            // 1. Mark session as complete in backend
            await videoCallService.completeSession(room.bookingId!);

            // 2. Check if user is learner to show review modal
            const isLearner = user.id !== sessionInfo.providerId;

            if (isLearner) {
                setShowReviewModal(true);
            } else {
                toast.success('Session completed');
                navigate('/sessions'); // Or provider session dashboard
            }
        } catch (err) {
            console.error('Error ending session:', err);
            // Even on error, try to show appropriate UI
            const isLearner = user.id !== sessionInfo.providerId;
            if (isLearner) {
                setShowReviewModal(true);
            } else {
                navigate('/sessions');
            }
        }
    };

    const handleLeave = () => {
        navigate('/sessions');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a2332] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-400">Joining session...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#1a2332] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/sessions')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Should not happen if loading/error logic is correct
    if (!room || !sessionInfo) return null;

    return (
        <>
            <VideoCallRoom
                room={room}
                sessionInfo={sessionInfo}
                onLeave={handleLeave}
                onSessionEnd={handleSessionEnd}
            />

            {showReviewModal && (
                <ReviewModal
                    bookingId={room.bookingId!}
                    onSubmitted={() => {
                        navigate('/sessions');
                    }}
                />
            )}
        </>
    );
}
