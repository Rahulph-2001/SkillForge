import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { EscrowTransaction } from '../../../domain/entities/EscrowTransaction';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
export declare class EscrowRepository extends BaseRepository<EscrowTransaction> implements IEscrowRepository {
    constructor(db: Database);
    private mapToDomain;
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
//# sourceMappingURL=EscrowRepository.d.ts.map