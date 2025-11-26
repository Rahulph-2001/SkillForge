

import { useState, useEffect, useCallback, useRef } from 'react';
import { OTPTimerService, OTPTimerState } from '../services/otpTimerService';

export interface UseOTPTimerOptions {
  email: string;
  expiresAt?: string | null;
  type: OTPTimerState['type'];
  defaultMinutes?: number;
  onExpire?: () => void;
}

export interface UseOTPTimerReturn {
  countdown: number;
  isExpired: boolean;
  formattedTime: string;
  resetTimer: (newExpiresAt?: string) => void;
  clearTimer: () => void;
}

export function useOTPTimer(options: UseOTPTimerOptions): UseOTPTimerReturn {
  const {
    email,
    expiresAt,
    type,
    defaultMinutes = 2,
    onExpire,
  } = options;

  const [countdown, setCountdown] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onExpireRef = useRef(onExpire);

  // Keep onExpire callback ref updated
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  /**
   * Initialize timer from localStorage or server expiry
   */
  const initializeTimer = useCallback(() => {
    // First, try to restore from localStorage
    const savedState = OTPTimerService.getTimerState();
    
    if (savedState && savedState.email === email && savedState.type === type) {
      // Restore from saved state
      const remaining = OTPTimerService.getRemainingSeconds(savedState.expiresAt);
      setCountdown(remaining);
      
      if (remaining === 0 && onExpireRef.current) {
        onExpireRef.current();
      }
    } else {
      // Initialize new timer
      const initial = OTPTimerService.initializeTimer(
        email,
        expiresAt,
        type,
        defaultMinutes
      );
      setCountdown(initial);
    }
  }, [email, expiresAt, type, defaultMinutes]);

  /**
   * Reset timer with new expiry time (for resend OTP)
   */
  const resetTimer = useCallback((newExpiresAt?: string) => {
    const expiry = newExpiresAt || expiresAt;
    const initial = OTPTimerService.initializeTimer(
      email,
      expiry,
      type,
      defaultMinutes
    );
    setCountdown(initial);
  }, [email, expiresAt, type, defaultMinutes]);

  /**
   * Clear timer and localStorage
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    OTPTimerService.clearTimerState();
    setCountdown(0);
  }, []);

  /**
   * Initialize timer on mount
   */
  useEffect(() => {
    initializeTimer();
  }, [initializeTimer]);

  /**
   * Countdown interval effect
   */
  useEffect(() => {
    if (countdown <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Start countdown interval
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        const newValue = Math.max(0, prev - 1);
        
        // Update localStorage with current state
        const savedState = OTPTimerService.getTimerState();
        if (savedState) {
          const remaining = OTPTimerService.getRemainingSeconds(savedState.expiresAt);
          if (remaining !== newValue) {
            // Sync with actual remaining time
            return remaining;
          }
        }
        
        // Trigger onExpire callback when countdown reaches 0
        if (newValue === 0 && onExpireRef.current) {
          onExpireRef.current();
        }
        
        return newValue;
      });
    }, 1000);

    // Cleanup interval on unmount or countdown change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [countdown]);

  return {
    countdown,
    isExpired: countdown === 0,
    formattedTime: OTPTimerService.formatTime(countdown),
    resetTimer,
    clearTimer,
  };
}
