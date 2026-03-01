import { type GetCreditTransactionsRequestDTO, type GetCreditTransactionsResponseDTO } from '../../../dto/credit/GetCreditTransactionsDTO';

export interface IGetCreditTransactionsUseCase {
    execute(request: GetCreditTransactionsRequestDTO): Promise<GetCreditTransactionsResponseDTO>;
}
