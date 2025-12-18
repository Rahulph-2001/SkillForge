export interface PendingRegistrationData {
    fullName: string;
    email: string;
    passwordHash: string;
    registrationIp?: string;
    bonusCredits: number;
    avatarUrl?: string;
}
export interface IPendingRegistrationService {
    /**
     * Store pending registration data temporarily (before OTP verification)
     */
    storePendingRegistration(email: string, data: PendingRegistrationData): Promise<void>;
    /**
     * Retrieve pending registration data
     */
    getPendingRegistration(email: string): Promise<PendingRegistrationData | null>;
    /**
     * Delete pending registration data (after successful verification or expiry)
     */
    deletePendingRegistration(email: string): Promise<void>;
}
//# sourceMappingURL=IPendingRegistrationService.d.ts.map