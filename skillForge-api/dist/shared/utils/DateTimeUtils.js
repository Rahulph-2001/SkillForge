"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeUtils = void 0;
/**
 * DateTimeUtils - Utility class for date and time validation and conversion
 */
class DateTimeUtils {
    /**
     * Validate time format (HH:MM)
     */
    static validateBookingTime(timeString) {
        // Validate time format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(timeString)) {
            return {
                valid: false,
                error: 'Invalid time format. Use HH:MM (24-hour format)'
            };
        }
        return { valid: true };
    }
    /**
     * Validate booking date is not in the past
     */
    static validateBookingDate(dateString, timeString, _timezone = 'UTC') {
        try {
            // Parse the date and time
            const [year, month, day] = dateString.split('-').map(Number);
            const [hours, minutes] = timeString.split(':').map(Number);
            // Create date object
            const bookingDate = new Date(year, month - 1, day, hours, minutes);
            const now = new Date();
            // Check if booking is in the past
            if (bookingDate <= now) {
                return {
                    valid: false,
                    error: 'Booking date and time must be in the future'
                };
            }
            return { valid: true };
        }
        catch (error) {
            return {
                valid: false,
                error: 'Invalid date or time format'
            };
        }
    }
    /**
     * Calculate hours until booking
     */
    static getHoursUntilBooking(bookingDate) {
        const now = new Date();
        const diffMs = bookingDate.getTime() - now.getTime();
        return diffMs / (1000 * 60 * 60); // Convert milliseconds to hours
    }
    /**
     * Calculate days until booking
     */
    static getDaysUntilBooking(bookingDate) {
        const now = new Date();
        const diffMs = bookingDate.getTime() - now.getTime();
        return diffMs / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    }
    /**
     * Convert time string (HH:MM) to minutes since midnight
     */
    static timeToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }
    /**
     * Validate session doesn't cross midnight
     */
    static validateSessionDoesNotCrossMidnight(_dateString, timeString, durationHours, _timezone = 'UTC') {
        try {
            const startMinutes = this.timeToMinutes(timeString);
            const endMinutes = startMinutes + (durationHours * 60);
            // Check if end time exceeds 24 hours (1440 minutes)
            if (endMinutes > 1440) {
                return {
                    valid: false,
                    error: 'Session cannot cross midnight. Please split into multiple sessions or choose an earlier start time.'
                };
            }
            return { valid: true };
        }
        catch (error) {
            return {
                valid: false,
                error: 'Invalid time format'
            };
        }
    }
    /**
     * Format date to YYYY-MM-DD
     */
    static formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    /**
     * Format time to HH:MM
     */
    static formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    /**
     * Parse date and time strings into a Date object
     */
    static parseDateTime(dateString, timeString) {
        const [year, month, day] = dateString.split('-').map(Number);
        const [hours, minutes] = timeString.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes);
    }
    /**
     * Check if a date is today
     */
    static isToday(date) {
        const today = new Date();
        return (date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear());
    }
    /**
     * Add days to a date
     */
    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    /**
     * Add hours to a date
     */
    static addHours(date, hours) {
        const result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    }
}
exports.DateTimeUtils = DateTimeUtils;
//# sourceMappingURL=DateTimeUtils.js.map