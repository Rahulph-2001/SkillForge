import { IJWTService } from '../../domain/services/IJWTService';
export declare class JWTService implements IJWTService {
    private readonly secret;
    private readonly expiresIn;
    private readonly refreshSecret;
    private readonly refreshExpiresIn;
    constructor();
    generateToken(payload: {
        userId: string;
        email: string;
        role: string;
    }): string;
    verifyToken(token: string): {
        userId: string;
        email: string;
        role: string;
    } | null;
    generateRefreshToken(payload: {
        userId: string;
        email: string;
    }): string;
    verifyRefreshToken(token: string): {
        userId: string;
        email: string;
    } | null;
}
//# sourceMappingURL=JWTService.d.ts.map