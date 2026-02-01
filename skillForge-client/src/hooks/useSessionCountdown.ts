import { useState, useEffect, useCallback } from 'react';

interface CountdownState {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isExpired: boolean;
    isSessionActive: boolean;
    formattedTime: string;
}

export function useSessionCountdown(
    sessionStartAt: Date | string | null,
    sessionEndAt: Date | string | null
): CountdownState {
    const [state, setState] = useState<CountdownState>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isExpired: false,
        isSessionActive: false,
        formattedTime: '--:--:--',
    });

    const calculateCountdown = useCallback(() => {
        if (!sessionStartAt || !sessionEndAt) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                totalSeconds: 0,
                isExpired: false,
                isSessionActive: false,
                formattedTime: '--:--:--',
            };
        }

        const now = new Date().getTime();
        const startTime = new Date(sessionStartAt).getTime();
        const endTime = new Date(sessionEndAt).getTime();

        // Session has ended
        if (now > endTime) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                totalSeconds: 0,
                isExpired: true,
                isSessionActive: false,
                formattedTime: 'Session Ended',
            };
        }

        // Session is active - show remaining time
        if (now >= startTime && now <= endTime) {
            const diff = endTime - now;
            const totalSeconds = Math.floor(diff / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            return {
                days: 0,
                hours,
                minutes,
                seconds,
                totalSeconds,
                isExpired: false,
                isSessionActive: true,
                formattedTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            };
        }

        // Session hasn't started - show countdown to start
        const diff = startTime - now;
        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        let formattedTime: string;
        if (days > 0) {
            formattedTime = `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            formattedTime = `${hours}h ${minutes}m ${seconds}s`;
        } else {
            formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        return {
            days,
            hours,
            minutes,
            seconds,
            totalSeconds,
            isExpired: false,
            isSessionActive: false,
            formattedTime,
        };
    }, [sessionStartAt, sessionEndAt]); // Removed sessionDurationMinutes as it's not used inside

    useEffect(() => {
        const updateCountdown = () => {
            setState(calculateCountdown());
        };

        updateCountdown(); // Initial update
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [calculateCountdown]);

    return state;
}
