import { injectable } from 'inversify';
import { IOTPService } from '../../domain/services/IOTPService';

@injectable()
export class OTPService implements IOTPService {
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}