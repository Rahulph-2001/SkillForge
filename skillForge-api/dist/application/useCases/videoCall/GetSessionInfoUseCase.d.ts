import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { SessionInfoDTO } from '../../dto/videoCall/VideoCallRoomResponseDTO';
import { IGetSessionInfoUseCase } from './interfaces/IGetSessionInfoUseCase';
export declare class GetSessionInfoUseCase implements IGetSessionInfoUseCase {
    private bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(bookingId: string): Promise<SessionInfoDTO>;
    private parseDateTime;
}
//# sourceMappingURL=GetSessionInfoUseCase.d.ts.map