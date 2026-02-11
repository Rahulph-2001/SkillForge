import { GetCreditTransactionsRequestDTO, GetCreditTransactionsResponseDTO } from '../../../dto/credit/GetCreditTransactionsDTO';
export interface IGetCreditTransactionsUseCase {
    execute(request: GetCreditTransactionsRequestDTO): Promise<GetCreditTransactionsResponseDTO>;
}
//# sourceMappingURL=IGetCreditTransactionsUseCase.d.ts.map