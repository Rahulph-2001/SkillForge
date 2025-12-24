import { Router, Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { PaymentController } from '../../controllers/payment/PaymentController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import express from 'express';

@injectable()
export class PaymentRoutes {
    public router = Router();

    constructor(
        @inject(TYPES.PaymentController) private readonly paymentController: PaymentController
    ) {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // POST /api/v1/payments/create-intent
        this.router.post(
            '/create-intent',
            authMiddleware,
            (req: Request, res: Response, next: NextFunction) =>
                this.paymentController.createPaymentIntent(req, res, next)
        );

        // POST /api/v1/payments/confirm
        this.router.post(
            '/confirm',
            authMiddleware,
            (req: Request, res: Response, next: NextFunction) =>
                this.paymentController.confirmPayment(req, res, next)
        );

        // POST /api/v1/payments/webhook
        // Note: Webhook needs raw body for Stripe signature verification
        this.router.post(
            '/webhook',
            express.raw({ type: 'application/json' }),
            (req: Request, res: Response) =>
                this.paymentController.handleWebhook(req, res)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}