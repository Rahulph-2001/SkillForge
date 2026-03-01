import 'express';

declare global {
    namespace Express {
        interface User {
            id: string;
            userId: string;
            email: string;
            role: string;
        }
    }
}
