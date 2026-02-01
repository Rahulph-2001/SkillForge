import { useState, useEffect, useMemo } from 'react';
import { Video, Loader2, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { videoCallService, SessionTimeValidation } from '../../services/videoCallService';
import { useSessionCountdown } from '../../hooks/useSessionCountdown';
import { toast } from 'react-hot-toast';

interface JoinSessionButtonProps {
    sessionId: string;
    preferredDate: string;
    preferredTime: string;
    duration?: number;
    status: string;
    className?: string;
}

export default function JoinSessionButton({
    sessionId,
    preferredDate,
    preferredTime,
    duration = 60,
    status,
    className = '',
}: JoinSessionButtonProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [validationLoading, setValidationLoading] = useState(true);
    const [validation, setValidation] = useState<SessionTimeValidation | null>(null);

    // Parse session times
    // Parse session times with memoization to prevent infinite loops
    const { sessionStartAt, sessionEndAt } = useMemo(() => {
        const parseDateTime = (date: string, time: string): Date => {
            const [hours, minutes] = time.split(':').map(Number);
            const dateObj = new Date(date);
            dateObj.setHours(hours, minutes, 0, 0);
            return dateObj;
        };

        const start = parseDateTime(preferredDate, preferredTime);
        const end = new Date(start.getTime() + duration * 60 * 1000);
        return { sessionStartAt: start, sessionEndAt: end };
    }, [preferredDate, preferredTime, duration]);

    const countdown = useSessionCountdown(sessionStartAt, sessionEndAt);

    // Validate session time on mount and periodically
    useEffect(() => {
        const statusLower = status.toLowerCase();
        if (statusLower !== 'confirmed' && statusLower !== 'in_session') {
            setValidationLoading(false);
            return;
        }

        const validateTime = async () => {
            try {
                const result = await videoCallService.validateSessionTime(sessionId);
                setValidation(result);
            } catch {
                // Silent fail - we'll use local countdown as fallback
            } finally {
                setValidationLoading(false);
            }
        };

        validateTime();

        // Re-validate every 30 seconds
        const interval = setInterval(validateTime, 30000);
        return () => clearInterval(interval);
    }, [sessionId, status]);

    const handleJoinSession = async () => {
        try {
            setLoading(true);

            // Re-validate before joining
            const result = await videoCallService.validateSessionTime(sessionId);

            if (!result.canJoin) {
                toast.error(result.message);
                setValidation(result);
                return;
            }

            // Navigate to video call page
            navigate(`/session/${sessionId}/call`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Cannot join session at this time');
        } finally {
            setLoading(false);
        }
    };

    // Only show for confirmed or in_session status
    const statusLower = status.toLowerCase();
    if (statusLower !== 'confirmed' && statusLower !== 'in_session') {
        return null;
    }

    // Loading validation
    if (validationLoading) {
        return (
            <button
                disabled
                className={`flex items-center justify-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium ${className}`}
            >
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
            </button>
        );
    }

    // Session expired
    if (countdown.isExpired) {
        return (
            <div className={`flex items-center gap-2 text-gray-500 text-sm ${className}`}>
                <AlertCircle className="w-4 h-4" />
                Session Ended
            </div>
        );
    }

    // Session active or join window open (15 min before)
    const canJoin = validation?.canJoin || countdown.isSessionActive || countdown.totalSeconds <= 15 * 60;

    if (!canJoin) {
        return (
            <div className={`flex flex-col gap-1 ${className}`}>
                <button
                    disabled
                    className="flex items-center justify-center gap-2 bg-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                >
                    <Clock className="w-4 h-4" />
                    Join Session
                </button>
                <span className="text-xs text-gray-500 text-center">
                    Opens in {countdown.formattedTime}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <button
                onClick={handleJoinSession}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Video className="w-4 h-4" />
                )}
                Join Session
            </button>
            {countdown.isSessionActive && (
                <span className="text-xs text-green-600 text-center font-medium">
                    {countdown.formattedTime} remaining
                </span>
            )}
        </div>
    );
}
