import { RedisService } from './RedisService';
import { IPendingRegistrationService, PendingRegistrationData } from '../../domain/services/IPendingRegistrationService';
export declare class PendingRegistrationService implements IPendingRegistrationService {
    private readonly redisService;
    private readonly PENDING_REG_PREFIX;
    private readonly EXPIRY_MINUTES;
    constructor(redisService: RedisService);
    storePendingRegistration(email: string, data: PendingRegistrationData): Promise<void>;
    getPendingRegistration(email: string): Promise<PendingRegistrationData | null>;
    deletePendingRegistration(email: string): Promise<void>;
    private getPendingRegKey;
}
//# sourceMappingURL=PendingRegistrationService.d.ts.map