import { injectable } from 'inversify';
import jwt, { SignOptions } from 'jsonwebtoken';
import { IJWTService } from '../../domain/services/IJWTService';
import { env } from '../../config/env';

@injectable()
export class JWTService implements IJWTService {
  private readonly secret: string;
  private readonly expiresIn: string | number;
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: string | number;

  constructor() {
    this.secret = env.JWT_SECRET;
    this.expiresIn = env.JWT_EXPIRES_IN;
    this.refreshSecret = env.JWT_REFRESH_SECRET;
    this.refreshExpiresIn = env.JWT_REFRESH_EXPIRES_IN;
  }

  generateToken(payload: { userId: string; email: string; role: string }): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    } as SignOptions);
  }

  verifyToken(token: string): { userId: string; email: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, this.secret) as { userId: string; email: string; role: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  generateRefreshToken(payload: { userId: string; email: string }): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    } as SignOptions);
  }

  verifyRefreshToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, this.refreshSecret) as { userId: string; email: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }
}