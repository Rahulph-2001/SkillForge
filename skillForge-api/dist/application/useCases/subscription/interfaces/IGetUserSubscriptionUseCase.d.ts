import { UserSubscriptionResponseDTO } from '../../../dto/subscription/UserSubscriptionResponseDTO';
export interface IGetUserSubscriptionUseCase {
    execute(userId: string): Promise<UserSubscriptionResponseDTO>;
}
//# sourceMappingURL=IGetUserSubscriptionUseCase.d.ts.map