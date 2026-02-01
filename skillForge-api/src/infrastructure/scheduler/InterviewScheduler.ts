import cron from 'node-cron';
import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { IInterviewRepository } from '../../domain/repositories/IInterviewRepository';
import { InterviewStatus } from '../../domain/entities/Interview';

@injectable()
export class InterviewScheduler {
    constructor(
        @inject(TYPES.IInterviewRepository) private interviewRepository: IInterviewRepository
    ) { }

    public start(): void {
        // Run every minute
        cron.schedule('* * * * *', async () => {
            console.log('[InterviewScheduler] Checking for expired interviews...');
            try {
                const expiredCandidates = await this.interviewRepository.findExpiredInterviews();
                const now = new Date();

                for (const interview of expiredCandidates) {
                    const durationMs = interview.durationMinutes * 60 * 1000;
                    const endTime = new Date(interview.scheduledAt.getTime() + durationMs);

                    // If current time is past the end time (plus buffer if needed, but let's say strict end)
                    if (now > endTime) {
                        interview.complete();
                        await this.interviewRepository.update(interview);
                        console.log(`[InterviewScheduler] Marked interview ${interview.id} as COMPLETED`);
                    }
                }
            } catch (error) {
                console.error('[InterviewScheduler] Error checking interviews:', error);
            }
        });
        console.log('[InterviewScheduler] Service started');
    }
}
