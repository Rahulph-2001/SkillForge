import { Router } from 'express';
import { PaymentController } from '../../controllers/payment/PaymentController';
export declare class PaymentRoutes {
    private readonly paymentController;
    router: import("express-serve-static-core").Router;
    constructor(paymentController: PaymentController);
    private initializeRoutes;
    getRouter(): Router;
}
//# sourceMappingURL=paymentRoutes.d.ts.map