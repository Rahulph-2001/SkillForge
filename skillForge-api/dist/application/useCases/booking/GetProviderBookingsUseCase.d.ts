import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { IGetProviderBookingsUseCase, GetProviderBookingsRequestDTO, GetProviderBookingsResponseDTO } from './interfaces/IGetProviderBookingsUseCase';
export declare class GetProviderBookingsUseCase implements IGetProviderBookingsUseCase {
    private readonly bookingRepository;
    constructor(bookingRepository: IBookingRepository);
    execute(request: GetProviderBookingsRequestDTO): Promise<GetProviderBookingsResponseDTO>;
}
//# sourceMappingURL=GetProviderBookingsUseCase.d.ts.map