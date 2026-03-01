import { type PurchaseCreditPackageRequestDTO, type PurchaseCreditPackageResponseDTO } from '../../../dto/credit/PurchaseCreditPackageDTO';

export interface IPurchaseCreditPackageUseCase {
    execute(request: PurchaseCreditPackageRequestDTO): Promise<PurchaseCreditPackageResponseDTO>;
}
