import { BookingStrategy } from './strategies/BookingStrategy';
import { InterviewStrategy } from './strategies/InterviewStrategy';
import { type IVideoCallStrategy } from './strategies/IVideoCallStrategy';

export class VideoCallStrategyFactory {
    /**
     * Get the appropriate strategy based on the type
     */
    static getStrategy(type: 'booking' | 'interview'): IVideoCallStrategy {
        if (type === 'booking') return new BookingStrategy();
        if (type === 'interview') return new InterviewStrategy();
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Unknown video call type: ${type}`);
    }
}
