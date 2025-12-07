import { Profile } from 'passport-google-oauth20';
export declare class PassportService {
    constructor();
    private configureGoogleStrategy;
    private setupSerialization;
    initializePassport(): import("express").Handler;
    authenticateGoogle(): any;
    authenticateGoogleCallback(options: {
        failureRedirect: string;
    }): any;
}
declare global {
    namespace Express {
        interface User extends Profile {
        }
    }
}
//# sourceMappingURL=PassportService.d.ts.map