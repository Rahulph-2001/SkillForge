export interface IAdminManageReportUseCase {
    execute(reportId: string, adminId: string, action: 'RESOLVE' | 'DISMISS' | 'REVIEW', resolution?: string): Promise<void>;
}
//# sourceMappingURL=IAdminManageReportUseCase.d.ts.map