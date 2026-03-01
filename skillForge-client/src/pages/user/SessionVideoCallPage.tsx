import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { getErrorMessage } from '../../utils/errorUtils';

import VideoCallRoom from '../../components/video/VideoCallRoom';
import ReviewModal from '../../components/review/ReviewModal';
import { VideoCallStrategyFactory } from '../../services/VideoCallStrategyFactory';
import { videoCallService, type VideoCallRoom as IVideoCallRoom, type SessionInfo } from '../../services/videoCallService';
import { useAppSelector } from '../../store/hooks';
import { ROUTES } from "@/constants/routes";

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
            } catch (err: unknown) {
                console.error('Failed to join booking session:', err);
                setError(getErrorMessage(err) || 'Failed to join video call');
            } finally {
                setLoading(false);
            }
        };

        void initBooking();
    }, [bookingId, user]);

    const handleSessionEnd = async () => {
        if (!room || !sessionInfo || !user) return;

        const isLearner = user.id !== sessionInfo.providerId;

        try {
            // Mark session as complete in backend (releases escrow, updates booking status)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            await videoCallService.completeSession(room.bookingId!);
        } catch (err) {
            console.error('Error completing session:', err);
        }

        if (isLearner) {
            // Learner: Show review modal — video:room-ended broadcasts AFTER review submission
            setShowReviewModal(true);
        } else {
            // Provider: End the room immediately (broadcasts video:room-ended to learner)
            try {
                await videoCallService.endRoom(room.id);
            } catch (err) {
                console.error('Error ending room:', err);
            }
            toast.success('Session completed');
            navigate(ROUTES.SESSIONS);
        }
    };

    const handleReviewSubmitted = async () => {
        // After learner submits review, NOW end the video room
        // This broadcasts video:room-ended → provider's call drops
        if (room) {
            try {
                await videoCallService.endRoom(room.id);
            } catch (err) {
                console.error('Error ending room after review:', err);
            }
        }
        navigate(ROUTES.SESSIONS);
    };

    const handleLeave = () => {
        navigate(ROUTES.SESSIONS);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Joining session...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error}</p>
                    <button
                        onClick={() => navigate(ROUTES.SESSIONS)}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
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
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    bookingId={room.bookingId!}
                    onSubmitted={handleReviewSubmitted}
                />
            )}
        </>
    );
}
