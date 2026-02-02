import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetUserWalletDataUseCase } from './interfaces/IGetUserWalletDataUseCase';
import { UserWalletDataDTO } from '../../dto/wallet/UserWalletTransactionDTO';
export declare class GetUserWalletDataUseCase implements IGetUserWalletDataUseCase {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(userId: string): Promise<UserWalletDataDTO>;
}
//# sourceMappingURL=GetUserWalletDataUseCase.d.ts.map