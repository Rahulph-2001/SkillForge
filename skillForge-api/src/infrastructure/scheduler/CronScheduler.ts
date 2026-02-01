
import { injectable, inject } from 'inversify';
import cron from 'node-cron';
import { TYPES } from '../di/types';
import { ICheckSubscriptionExpiryUseCase } from '../../application/useCases/subscription/interfaces/ICheckSubscriptionExpiryUseCase';

@injectable()
export class CronScheduler {
    constructor(
        @inject(TYPES.ICheckSubscriptionExpiryUseCase) private checkSubscriptionExpiryUseCase: ICheckSubscriptionExpiryUseCase
    ) { }

    public start(): void {
        console.log('Starting Cron Scheduler...');

        // Run every day at midnight to check for expired subscriptions
        // Cron format: 0 0 * * * (At 00:00 every day)
        cron.schedule('0 0 * * *', async () => {
            console.log('[Cron] Running daily subscription expiry check...');
            try {
                await this.checkSubscriptionExpiryUseCase.execute();
                console.log('[Cron] Subscription expiry check completed.');
            } catch (error) {
                console.error('[Cron] Error running subscription expiry check:', error);
            }
        });

        // Run every hour just in case (optional, for tighter expiry control)
        // cron.schedule('0 * * * *', async () => { ... });

        console.log('Cron Scheduler started successfully.');
    }
}
