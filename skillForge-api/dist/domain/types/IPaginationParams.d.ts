export interface IPaginationParams {
    page: number;
    limit: number;
    skip: number;
    take: number;
}
export interface IPaginationResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
//# sourceMappingURL=IPaginationParams.d.ts.map