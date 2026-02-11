import { GetUserCreditPackagesResponseDTO } from '../../../dto/credit/GetUserCreditPackagesDTO';

export interface IGetUserCreditPackagesUseCase {
    execute(): Promise<GetUserCreditPackagesResponseDTO>;
}
