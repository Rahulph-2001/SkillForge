import { UserWalletDataDTO } from '../../../dto/wallet/UserWalletTransactionDTO';
export interface IGetUserWalletDataUseCase {
    execute(userId: string): Promise<UserWalletDataDTO>;
}
//# sourceMappingURL=IGetUserWalletDataUseCase.d.ts.map