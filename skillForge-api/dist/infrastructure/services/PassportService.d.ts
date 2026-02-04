import { Profile } from 'passport-google-oauth20';
import { RequestHandler } from 'express';
import { IPassportService } from '../../domain/services/IPassportService';
export declare class PassportService implements IPassportService {
    constructor();
    private configureGoogleStrategy;
    private setupSerialization;
    initializePassport(): RequestHandler;
    authenticateGoogle(): RequestHandler;
    authenticateGoogleCallback(options: {
        failureRedirect: string;
    }): RequestHandler;
}
declare global {
    namespace Express {
        interface User extends Profile {
        }
    }
}
//# sourceMappingURL=PassportService.d.ts.map