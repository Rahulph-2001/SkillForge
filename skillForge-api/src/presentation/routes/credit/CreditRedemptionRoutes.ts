import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { CreditRedemptionController } from '../../controllers/credit/CreditRedemptionController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';
import { UserRole } from '../../../domain/enums/UserRole';

@injectable()
export class CreditRedemptionRoutes {
    public router: Router;

    constructor(
        @inject(TYPES.CreditRedemptionController) private controller: CreditRedemptionController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(
            '/wallet-info',
            authMiddleware,
            (req, res) => this.controller.getWalletInfo(req, res)
        );

        this.router.post(
            '/redeem',
            authMiddleware,
            (req, res) => this.controller.redeemCredits(req, res)
        );

        this.router.post(
            '/request-withdrawal',
            authMiddleware,
            (req, res) => this.controller.requestWithdrawal(req, res)
        );

        this.router.get(
            '/admin/conversion-rate',
            authMiddleware,
            adminMiddleware,
            (req, res) => this.controller.getConversionRate(req, res)
        );

        this.router.put(
            '/admin/conversion-rate',
            authMiddleware,
            adminMiddleware,
            (req, res) => this.controller.setConversionRate(req, res)
        );
    }
}
