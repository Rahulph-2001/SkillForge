import { BlockedDate } from '../../domain/entities/ProviderAvailability';
export interface ValidationResult {
    valid: boolean;
    error?: string;
}
export interface DaySchedule {
    enabled: boolean;
    slots: {
        start: string;
        end: string;
    }[];
}
export declare class BookingValidator {
    /**
     * Validate date and time format
     */
    static validateDateTimeFormat(dateString: string, timeString: string): ValidationResult;
    /**
     * Validate date is not in the past
     */
    static validateDateNotInPast(dateString: string, timeString: string, timezone?: string): ValidationResult;
    /**
     * Validate booking is within advance booking window
     */
    static validateWithinAdvanceBookingWindow(bookingDate: Date, minHours: number, maxDays: number): ValidationResult;
    /**
     * Validate booking date is not in blocked dates
     */
    static validateAgainstBlockedDates(dateString: string, blockedDates: BlockedDate[]): ValidationResult;
    /**
     * Validate booking is within provider's working hours
     */
    static validateWithinWorkingHours(startTime: string, durationHours: number, daySchedule: DaySchedule): ValidationResult;
    /**
     * Validate session doesn't cross midnight
     */
    static validateSessionWithinSameDay(dateString: string, timeString: string, durationHours: number, timezone?: string): ValidationResult;
    /**
     * Validate learner is not booking their own skill
     */
    static validateNotSelfBooking(learnerId: string, providerId: string): ValidationResult;
    /**
     * Validate booking parameters are present
     */
    static validateRequiredFields(params: {
        learnerId?: string;
        skillId?: string;
        providerId?: string;
        preferredDate?: string;
        preferredTime?: string;
    }): ValidationResult;
}
//# sourceMappingURL=BookingValidator.d.ts.map