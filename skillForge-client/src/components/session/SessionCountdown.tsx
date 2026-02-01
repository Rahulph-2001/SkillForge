import { Clock, AlertCircle, CheckCircle, Timer } from 'lucide-react';
import { useSessionCountdown } from '../../hooks/useSessionCountdown';

interface SessionCountdownProps {
    sessionStartAt: Date | string | null;
    sessionEndAt: Date | string | null;
    sessionDurationMinutes?: number;
    showLabels?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function SessionCountdown({
    sessionStartAt,
    sessionEndAt,
    sessionDurationMinutes = 60,
    showLabels = true,
    size = 'md',
}: SessionCountdownProps) {
    const countdown = useSessionCountdown(sessionStartAt, sessionEndAt);

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    // Session has ended
    if (countdown.isExpired) {
        return (
            <div className={`flex items-center gap-2 text-gray-500 ${sizeClasses[size]}`}>
                <AlertCircle className={iconSizes[size]} />
                <span>Session Ended</span>
            </div>
        );
    }

    // Session is active - show remaining time
    if (countdown.isSessionActive) {
        return (
            <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-2 text-green-600 ${sizeClasses[size]}`}>
                    <CheckCircle className={`${iconSizes[size]} animate-pulse`} />
                    <span className="font-semibold">Session Active</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                    <Timer className={iconSizes[size]} />
                    <span className="font-mono font-bold">{countdown.formattedTime}</span>
                    {showLabels && <span className="text-gray-500">remaining</span>}
                </div>
            </div>
        );
    }

    // Session hasn't started - show countdown
    const isJoinWindowOpen = countdown.totalSeconds <= 15 * 60; // 15 minutes

    return (
        <div className="flex flex-col gap-1">
            <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
                <Clock className={`${iconSizes[size]} ${isJoinWindowOpen ? 'text-green-600' : 'text-amber-600'}`} />
                <span className={`font-semibold ${isJoinWindowOpen ? 'text-green-600' : 'text-amber-600'}`}>
                    {isJoinWindowOpen ? 'Join Window Open' : 'Starts In'}
                </span>
            </div>
            <div className={`font-mono font-bold text-gray-800 ${sizeClasses[size]}`}>
                {countdown.formattedTime}
            </div>
            {showLabels && !isJoinWindowOpen && countdown.totalSeconds > 15 * 60 && (
                <span className="text-xs text-gray-500">
                    Join window opens 15 min before
                </span>
            )}
        </div>
    );
}
