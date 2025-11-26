import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { IPasswordService } from '../../domain/services/IPasswordService';

@injectable()
export class PasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}