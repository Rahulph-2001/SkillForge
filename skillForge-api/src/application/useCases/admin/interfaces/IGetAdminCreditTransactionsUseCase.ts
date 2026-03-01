export interface IGetAdminCreditTransactionsUseCase {
    execute(page: number, limit: number, search?: string): Promise<Record<string, unknown>>;
}
