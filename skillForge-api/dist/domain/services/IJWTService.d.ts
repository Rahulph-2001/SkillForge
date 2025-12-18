export interface IJWTService {
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
//# sourceMappingURL=IJWTService.d.ts.map