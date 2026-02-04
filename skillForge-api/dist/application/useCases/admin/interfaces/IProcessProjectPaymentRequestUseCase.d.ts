export interface IProcessProjectPaymentRequestUseCase {
    execute(requestId: string, adminId: string, approved: boolean, notes?: string, overrideAction?: 'OVERRIDE_RELEASE'): Promise<void>;
}
//# sourceMappingURL=IProcessProjectPaymentRequestUseCase.d.ts.map