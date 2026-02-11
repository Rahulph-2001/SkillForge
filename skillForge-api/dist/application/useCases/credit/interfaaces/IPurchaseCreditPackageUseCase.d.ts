import { PurchaseCreditPackageRequestDTO, PurchaseCreditPackageResponseDTO } from '../../../dto/credit/PurchaseCreditPackageDTO';
export interface IPurchaseCreditPackageUseCase {
    execute(request: PurchaseCreditPackageRequestDTO): Promise<PurchaseCreditPackageResponseDTO>;
}
//# sourceMappingURL=IPurchaseCreditPackageUseCase.d.ts.map