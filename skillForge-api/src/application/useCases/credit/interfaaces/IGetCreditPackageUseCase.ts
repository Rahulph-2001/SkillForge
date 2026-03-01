import { type IPaginationResult } from "../../../../domain/types/IPaginationParams";
import { type CreditPackageResponseDTO } from "../../../dto/credit/CreditPackageDTO";


export interface IGetCreditPackageUseCase {
    execute(page: number, limit: number, filters?: {isActive?: boolean}):Promise<IPaginationResult<CreditPackageResponseDTO>>;
}