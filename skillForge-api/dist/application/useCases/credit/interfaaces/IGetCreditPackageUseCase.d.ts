import { IPaginationResult } from "../../../../domain/types/IPaginationParams";
import { CreditPackageResponseDTO } from "../../../dto/credit/CreditPackageDTO";
export interface IGetCreditPackageUseCase {
    execute(page: number, limit: number, filters?: {
        isActive?: boolean;
    }): Promise<IPaginationResult<CreditPackageResponseDTO>>;
}
//# sourceMappingURL=IGetCreditPackageUseCase.d.ts.map