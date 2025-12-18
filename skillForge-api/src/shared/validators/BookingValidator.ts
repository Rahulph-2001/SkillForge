
import { DateTimeUtils } from '../utils/DateTimeUtils';
import { BlockedDate } from '../../domain/entities/ProviderAvailability';

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

export interface DaySchedule {
    enabled: boolean;
    slots: { start: string; end: string }[];
}

export class BookingValidator {
    /**
     * Validate date and time format
     */
    static validateDateTimeFormat(
        dateString: string,
        timeString: string
    ): ValidationResult {
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateString)) {
            return {
                valid: false,
                error: 'Invalid date format. Use YYYY-MM-DD'
            };
        }

        // Validate time
        const timeValidation = DateTimeUtils.validateBookingTime(timeString);
        if (!timeValidation.valid) {
            return timeValidation;
        }

        // Validate actual date values
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
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
    static validateDateNotInPast(
        dateString: string,
        timeString: string,
        timezone: string = 'UTC'
    ): ValidationResult {
        return DateTimeUtils.validateBookingDate(dateString, timeString, timezone);
    }

    /**
     * Validate booking is within advance booking window
     */
    static validateWithinAdvanceBookingWindow(
        bookingDate: Date,
        minHours: number,
        maxDays: number
    ): ValidationResult {
        const hoursUntil = DateTimeUtils.getHoursUntilBooking(bookingDate);

        if (hoursUntil < minHours) {
            return {
                valid: false,
                error: `Booking must be at least ${minHours} hours in advance`
            };
        }

        const daysUntil = DateTimeUtils.getDaysUntilBooking(bookingDate);
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
    static validateAgainstBlockedDates(
        dateString: string,
        blockedDates: BlockedDate[]
    ): ValidationResult {
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
    static validateWithinWorkingHours(
        startTime: string,
        durationHours: number,
        daySchedule: DaySchedule
    ): ValidationResult {
        if (!daySchedule.enabled) {
            return {
                valid: false,
                error: 'Provider does not work on this day'
            };
        }

        const startMinutes = DateTimeUtils.timeToMinutes(startTime);
        const endMinutes = startMinutes + (durationHours * 60);

        const isWithinSlot = daySchedule.slots.some(slot => {
            const slotStart = DateTimeUtils.timeToMinutes(slot.start);
            const slotEnd = DateTimeUtils.timeToMinutes(slot.end);
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
    static validateSessionWithinSameDay(
        dateString: string,
        timeString: string,
        durationHours: number,
        timezone: string = 'UTC'
    ): ValidationResult {
        return DateTimeUtils.validateSessionDoesNotCrossMidnight(
            dateString,
            timeString,
            durationHours,
            timezone
        );
    }

    /**
     * Validate learner is not booking their own skill
     */
    static validateNotSelfBooking(
        learnerId: string,
        providerId: string
    ): ValidationResult {
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
    static validateRequiredFields(params: {
        learnerId?: string;
        skillId?: string;
        providerId?: string;
        preferredDate?: string;
        preferredTime?: string;
    }): ValidationResult {
        const required = ['learnerId', 'skillId', 'providerId', 'preferredDate', 'preferredTime'];

        for (const field of required) {
            if (!params[field as keyof typeof params]) {
                return {
                    valid: false,
                    error: `Missing required field: ${field}`
                };
            }
        }

        return { valid: true };
    }
}
