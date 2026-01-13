import { IPaginationParams, IPaginationResult } from "../types/IPaginationParams";
export interface IPaginationService {
    createParams(page: number, limit: number): IPaginationParams;
    createResult<T>(data: T[], total: number, page: number, limit: number): IPaginationResult<T>;
    validatePaginationParams(page: number, limit: number): {
        page: number;
        limit: number;
    };
}
//# sourceMappingURL=IPaginationService.d.ts.map