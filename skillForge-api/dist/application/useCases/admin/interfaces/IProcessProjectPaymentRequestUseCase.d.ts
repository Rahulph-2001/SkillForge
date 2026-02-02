export interface IProcessProjectPaymentRequestUseCase {
    execute(requestId: string, adminId: string, approved: boolean, notes?: string): Promise<void>;
}
//# sourceMappingURL=IProcessProjectPaymentRequestUseCase.d.ts.map