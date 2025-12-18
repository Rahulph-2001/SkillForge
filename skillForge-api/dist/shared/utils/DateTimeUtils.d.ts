export interface ValidationResult {
    valid: boolean;
    error?: string;
}
/**
 * DateTimeUtils - Utility class for date and time validation and conversion
 */
export declare class DateTimeUtils {
    /**
     * Validate time format (HH:MM)
     */
    static validateBookingTime(timeString: string): ValidationResult;
    /**
     * Validate booking date is not in the past
     */
    static validateBookingDate(dateString: string, timeString: string, _timezone?: string): ValidationResult;
    /**
     * Calculate hours until booking
     */
    static getHoursUntilBooking(bookingDate: Date): number;
    /**
     * Calculate days until booking
     */
    static getDaysUntilBooking(bookingDate: Date): number;
    /**
     * Convert time string (HH:MM) to minutes since midnight
     */
    static timeToMinutes(timeString: string): number;
    /**
     * Validate session doesn't cross midnight
     */
    static validateSessionDoesNotCrossMidnight(_dateString: string, timeString: string, durationHours: number, _timezone?: string): ValidationResult;
    /**
     * Format date to YYYY-MM-DD
     */
    static formatDate(date: Date): string;
    /**
     * Format time to HH:MM
     */
    static formatTime(date: Date): string;
    /**
     * Parse date and time strings into a Date object
     */
    static parseDateTime(dateString: string, timeString: string): Date;
    /**
     * Check if a date is today
     */
    static isToday(date: Date): boolean;
    /**
     * Add days to a date
     */
    static addDays(date: Date, days: number): Date;
    /**
     * Add hours to a date
     */
    static addHours(date: Date, hours: number): Date;
}
//# sourceMappingURL=DateTimeUtils.d.ts.map