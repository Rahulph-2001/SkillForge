import { IGetProviderReviewsUseCase } from './interfaces/IGetProviderReviewsUseCase';
import { ProviderReviewResponseDTO } from '../../dto/user/ProviderReviewResponseDTO';
export declare class GetProviderReviewsUseCase implements IGetProviderReviewsUseCase {
    constructor();
    execute(_userId: string): Promise<ProviderReviewResponseDTO[]>;
}
//# sourceMappingURL=GetProviderReviewsUseCase.d.ts.map