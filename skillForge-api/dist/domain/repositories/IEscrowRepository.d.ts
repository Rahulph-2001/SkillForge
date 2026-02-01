import { EscrowTransaction } from '../entities/EscrowTransaction';
export interface IEscrowRepository {
    findByBookingId(bookingId: string): Promise<EscrowTransaction | null>;
    findByLearnerId(learnerId: string): Promise<EscrowTransaction[]>;
    findByProviderId(providerId: string): Promise<EscrowTransaction[]>;
    holdCredits(bookingId: string, learnerId: string, providerId: string, amount: number): Promise<EscrowTransaction>;
    releaseCredits(bookingId: string): Promise<EscrowTransaction>;
    refundCredits(bookingId: string): Promise<EscrowTransaction>;
    getEscrowStats(userId: string): Promise<{
        totalHeld: number;
        totalReleased: number;
        totalRefunded: number;
    }>;
}
//# sourceMappingURL=IEscrowRepository.d.ts.map