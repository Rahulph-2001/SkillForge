

export interface OTPTimerState {
  email: string;
  expiresAt: string; // ISO timestamp from server
  type: 'email-verification' | 'forgot-password';
}

export class OTPTimerService {
  private static readonly STORAGE_KEY = 'otp_timer_state';

  /**
   * Save OTP timer state to localStorage
   */
  static saveTimerState(state: OTPTimerState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save OTP timer state:', error);
    }
  }

  /**
   * Get OTP timer state from localStorage
   */
  static getTimerState(): OTPTimerState | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const state: OTPTimerState = JSON.parse(stored);
      
      // Validate expiry hasn't passed
      if (this.isExpired(state.expiresAt)) {
        this.clearTimerState();
        return null;
      }

      return state;
    } catch (error) {
      console.error('Failed to get OTP timer state:', error);
      return null;
    }
  }

  /**
   * Calculate remaining seconds until expiry
   */
  static getRemainingSeconds(expiresAt: string): number {
    try {
      const expiryTime = new Date(expiresAt).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
      return remaining;
    } catch (error) {
      console.error('Failed to calculate remaining seconds:', error);
      return 0;
    }
  }

  /**
   * Check if OTP has expired
   */
  static isExpired(expiresAt: string): boolean {
    try {
      const expiryTime = new Date(expiresAt).getTime();
      return Date.now() >= expiryTime;
    } catch (error) {
      console.error('Failed to check expiry:', error);
      return true;
    }
  }

  /**
   * Clear timer state from localStorage
   */
  static clearTimerState(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear OTP timer state:', error);
    }
  }

  /**
   * Update timer state with new expiry time (for resend OTP)
   */
  static updateExpiryTime(expiresAt: string): void {
    try {
      const currentState = this.getTimerState();
      if (currentState) {
        this.saveTimerState({
          ...currentState,
          expiresAt,
        });
      }
    } catch (error) {
      console.error('Failed to update expiry time:', error);
    }
  }

  /**
   * Format seconds to MM:SS display format
   */
  static formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Get expiry time from server response and calculate initial countdown
   */
  static initializeTimer(
    email: string,
    expiresAt: string | null | undefined,
    type: OTPTimerState['type'],
    defaultMinutes: number = 2
  ): number {
    let expiryTimestamp: string;

    if (expiresAt) {
      // Use server-provided expiry time
      expiryTimestamp = expiresAt;
    } else {
      // Fallback: calculate expiry based on default minutes
      const expiry = new Date(Date.now() + defaultMinutes * 60 * 1000);
      expiryTimestamp = expiry.toISOString();
    }

    // Save to localStorage
    this.saveTimerState({
      email,
      expiresAt: expiryTimestamp,
      type,
    });

    // Return initial countdown in seconds
    return this.getRemainingSeconds(expiryTimestamp);
  }
}
