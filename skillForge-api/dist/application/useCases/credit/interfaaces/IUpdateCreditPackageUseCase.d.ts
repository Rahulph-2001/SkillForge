import { UpdateCreditPackageDTO } from "../../../dto/credit/CreditPackageDTO";
import { CreditPackageResponseDTO } from "../../../dto/credit/CreditPackageDTO";
export interface IUpdateCreditPackageUseCase {
    execute(id: string, dto: UpdateCreditPackageDTO): Promise<CreditPackageResponseDTO>;
}
//# sourceMappingURL=IUpdateCreditPackageUseCase.d.ts.map