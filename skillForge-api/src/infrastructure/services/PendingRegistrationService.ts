import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { RedisService } from './RedisService';
import { 
  IPendingRegistrationService, 
  PendingRegistrationData 
} from '../../domain/services/IPendingRegistrationService';


@injectable()
export class PendingRegistrationService implements IPendingRegistrationService {
  private readonly PENDING_REG_PREFIX = 'pending_registration:';
  private readonly EXPIRY_MINUTES = 15; // 15 minutes to complete OTP verification

  constructor(
    @inject(TYPES.RedisService) private readonly redisService: RedisService
  ) {}

  async storePendingRegistration(
    email: string, 
    data: PendingRegistrationData
  ): Promise<void> {
    const key = this.getPendingRegKey(email);
    const dataString = JSON.stringify(data);
    
    await this.redisService.set(key, dataString);
    await this.redisService.expire(key, this.EXPIRY_MINUTES * 60);
  }

  async getPendingRegistration(email: string): Promise<PendingRegistrationData | null> {
    const key = this.getPendingRegKey(email);
    const dataString = await this.redisService.get(key);
    
    if (!dataString) {
      return null;
    }

    try {
      return JSON.parse(dataString) as PendingRegistrationData;
    } catch (error) {
      console.error('Failed to parse pending registration data:', error);
      return null;
    }
  }

  async deletePendingRegistration(email: string): Promise<void> {
    const key = this.getPendingRegKey(email);
    await this.redisService.delete(key);
  }

  private getPendingRegKey(email: string): string {
    return `${this.PENDING_REG_PREFIX}${email.toLowerCase()}`;
  }
}
