import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import VideoCallRoom from '../../components/video/VideoCallRoom';
import { VideoCallStrategyFactory } from '../../services/VideoCallStrategyFactory';
import { VideoCallRoom as IVideoCallRoom, SessionInfo } from '../../services/videoCallService';
import { useAppSelector } from '../../store/hooks';

export default function InterviewVideoCallPage() {
    const { interviewId } = useParams<{ interviewId: string }>();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const [room, setRoom] = useState<IVideoCallRoom | null>(null);
    const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!interviewId || !user) return;

        const initInterview = async () => {
            try {
                setLoading(true);
                const strategy = VideoCallStrategyFactory.getStrategy('interview');

                // Parallel fetch
                const [roomData, sessionData] = await Promise.all([
                    strategy.getRoom(interviewId),
                    strategy.getSessionInfo(interviewId)
                ]);

                // Interview validation usually laxer, or handled by backend room creation
                // We can add strategy.validateTime if interface has it? 
                // IVideoCallStrategy has validateTime? Yes.
                // But for interviews maybe strictly "time checks" are backend enforced during "join room" mostly.
                // Let's call it for consistency if needed, but InterviewStrategy implementation might vary.
                // Reviewing InterviewStrategy: validateTime returns { canJoin: true }. So it's safe.

                const validation = await strategy.validateTime(interviewId);
                if (validation && !validation.canJoin) {
                    setError(validation.message);
                    setLoading(false);
                    return;
                }

                setRoom(roomData);
                setSessionInfo(sessionData);
            } catch (err: any) {
                console.error('Failed to join interview session:', err);
                setError(err.response?.data?.error || err.message || 'Failed to join interview');
            } finally {
                setLoading(false);
            }
        };

        initInterview();
    }, [interviewId, user]);

    const handleSessionEnd = async () => {
        // For interviews, we might not have a formal "complete" step yet, 
        // or it's just leaving.
        toast.success('Interview ended');
        navigate('/my-projects');
    };

    const handleLeave = () => {
        navigate('/my-projects');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a2332] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-400">Joining interview...</p>
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
                        onClick={() => navigate('/my-projects')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!room || !sessionInfo) return null;

    return (
        <VideoCallRoom
            room={room}
            sessionInfo={sessionInfo}
            onLeave={handleLeave}
            onSessionEnd={handleSessionEnd}
        />
    );
}
