import { IPaginationService } from "../../domain/services/IPaginationService";
import { IPaginationParams, IPaginationResult } from "../../domain/types/IPaginationParams";
export declare class PaginationService implements IPaginationService {
    private readonly DEFAULT_PAGE;
    private readonly DEFAULT_LIMIT;
    private readonly MAX_LIMIT;
    private readonly MIN_LIMIT;
    createParams(page: number, limit: number): IPaginationParams;
    createResult<T>(data: T[], total: number, page: number, limit: number): IPaginationResult<T>;
    validatePaginationParams(page: number, limit: number): {
        page: number;
        limit: number;
    };
}
//# sourceMappingURL=PaginationService.d.ts.map