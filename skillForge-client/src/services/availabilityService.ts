import api from './api';

export interface WeeklySchedule {
    [key: string]: {
        enabled: boolean;
        slots: { start: string; end: string }[];
    };
}

export interface BlockedDate {
    date: string;
    label?: string;
}

export interface ProviderAvailability {
    id: string;
    providerId: string;
    weeklySchedule: WeeklySchedule;
    timezone: string;
    bufferTime: number;
    minAdvanceBooking: number;
    maxAdvanceBooking: number;
    autoAccept: boolean;
    blockedDates: BlockedDate[];
    maxSessionsPerDay?: number;
}

export const availabilityService = {
    getAvailability: async (): Promise<ProviderAvailability> => {
        const response = await api.get('/availability');
        return response.data.data;
    },

    updateAvailability: async (data: Partial<ProviderAvailability>): Promise<ProviderAvailability> => {
        const response = await api.put('/availability', data);
        return response.data.data;
    },
};
