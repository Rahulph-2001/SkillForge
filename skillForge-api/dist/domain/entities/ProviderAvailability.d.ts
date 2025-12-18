export interface WeeklySchedule {
    [key: string]: {
        enabled: boolean;
        slots: {
            start: string;
            end: string;
        }[];
    };
}
export interface BlockedDate {
    date: string;
    label?: string;
}
export declare class ProviderAvailability {
    readonly id: string;
    readonly providerId: string;
    weeklySchedule: WeeklySchedule;
    timezone: string;
    bufferTime: number;
    minAdvanceBooking: number;
    maxAdvanceBooking: number;
    autoAccept: boolean;
    blockedDates: BlockedDate[];
    maxSessionsPerDay?: number | null | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, providerId: string, weeklySchedule: WeeklySchedule, timezone: string, bufferTime: number, minAdvanceBooking: number, maxAdvanceBooking: number, autoAccept: boolean, blockedDates: BlockedDate[], maxSessionsPerDay?: number | null | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined);
    static create(providerId: string, weeklySchedule?: WeeklySchedule, timezone?: string, bufferTime?: number, minAdvanceBooking?: number, maxAdvanceBooking?: number, autoAccept?: boolean, blockedDates?: BlockedDate[], maxSessionsPerDay?: number | null): ProviderAvailability;
}
//# sourceMappingURL=ProviderAvailability.d.ts.map