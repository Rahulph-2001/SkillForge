export interface IAdminGetSessionStatsUseCase {
    execute(): Promise<{
        totalSessions: number;
        completed: number;
        upcoming: number;
        cancelled: number;
    }>;
}
