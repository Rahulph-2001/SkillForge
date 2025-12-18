"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidator = void 0;
const DateTimeUtils_1 = require("../utils/DateTimeUtils");
class BookingValidator {
    /**
     * Validate date and time format
     */
    static validateDateTimeFormat(dateString, timeString) {
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateString)) {
            return {
                valid: false,
                error: 'Invalid date format. Use YYYY-MM-DD'
            };
        }
        // Validate time
        const timeValidation = DateTimeUtils_1.DateTimeUtils.validateBookingTime(timeString);
        if (!timeValidation.valid) {
            return timeValidation;
        }
        // Validate actual date values
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day) {
            return {
                valid: false,
                error: 'Invalid date values'
            };
        }
        return { valid: true };
    }
    /**
     * Validate date is not in the past
     */
    static validateDateNotInPast(dateString, timeString, timezone = 'UTC') {
        return DateTimeUtils_1.DateTimeUtils.validateBookingDate(dateString, timeString, timezone);
    }
    /**
     * Validate booking is within advance booking window
     */
    static validateWithinAdvanceBookingWindow(bookingDate, minHours, maxDays) {
        const hoursUntil = DateTimeUtils_1.DateTimeUtils.getHoursUntilBooking(bookingDate);
        if (hoursUntil < minHours) {
            return {
                valid: false,
                error: `Booking must be at least ${minHours} hours in advance`
            };
        }
        const daysUntil = DateTimeUtils_1.DateTimeUtils.getDaysUntilBooking(bookingDate);
        if (daysUntil > maxDays) {
            return {
                valid: false,
                error: `Booking cannot be more than ${maxDays} days in advance`
            };
        }
        return { valid: true };
    }
    /**
     * Validate booking date is not in blocked dates
     */
    static validateAgainstBlockedDates(dateString, blockedDates) {
        const isBlocked = blockedDates.some(blocked => blocked.date === dateString);
        if (isBlocked) {
            const blockedDate = blockedDates.find(b => b.date === dateString);
            const label = blockedDate?.label ? ` (${blockedDate.label})` : '';
            return {
                valid: false,
                error: `Provider is unavailable on ${dateString}${label}`
            };
        }
        return { valid: true };
    }
    /**
     * Validate booking is within provider's working hours
     */
    static validateWithinWorkingHours(startTime, durationHours, daySchedule) {
        if (!daySchedule.enabled) {
            return {
                valid: false,
                error: 'Provider does not work on this day'
            };
        }
        const startMinutes = DateTimeUtils_1.DateTimeUtils.timeToMinutes(startTime);
        const endMinutes = startMinutes + (durationHours * 60);
        const isWithinSlot = daySchedule.slots.some(slot => {
            const slotStart = DateTimeUtils_1.DateTimeUtils.timeToMinutes(slot.start);
            const slotEnd = DateTimeUtils_1.DateTimeUtils.timeToMinutes(slot.end);
            return startMinutes >= slotStart && endMinutes <= slotEnd;
        });
        if (!isWithinSlot) {
            return {
                valid: false,
                error: 'Requested time is outside provider working hours'
            };
        }
        return { valid: true };
    }
    /**
     * Validate session doesn't cross midnight
     */
    static validateSessionWithinSameDay(dateString, timeString, durationHours, timezone = 'UTC') {
        return DateTimeUtils_1.DateTimeUtils.validateSessionDoesNotCrossMidnight(dateString, timeString, durationHours, timezone);
    }
    /**
     * Validate learner is not booking their own skill
     */
    static validateNotSelfBooking(learnerId, providerId) {
        if (learnerId === providerId) {
            return {
                valid: false,
                error: 'Cannot book your own skill'
            };
        }
        return { valid: true };
    }
    /**
     * Validate booking parameters are present
     */
    static validateRequiredFields(params) {
        const required = ['learnerId', 'skillId', 'providerId', 'preferredDate', 'preferredTime'];
        for (const field of required) {
            if (!params[field]) {
                return {
                    valid: false,
                    error: `Missing required field: ${field}`
                };
            }
        }
        return { valid: true };
    }
}
exports.BookingValidator = BookingValidator;
//# sourceMappingURL=BookingValidator.js.map