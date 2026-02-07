export interface IGetUnreadCountUseCase {
    execute(userId: string): Promise<{
        count: number;
    }>;
}
//# sourceMappingURL=IGetUnreadCountUseCase.d.ts.map