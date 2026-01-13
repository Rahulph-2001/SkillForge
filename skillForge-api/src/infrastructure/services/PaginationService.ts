import { injectable } from "inversify";
import { IPaginationService } from "../../domain/services/IPaginationService";
import { IPaginationParams,IPaginationResult } from "../../domain/types/IPaginationParams";

@injectable()
export class PaginationService implements IPaginationService {
    private readonly DEFAULT_PAGE = 1;
    private readonly DEFAULT_LIMIT = 20;
    private readonly MAX_LIMIT = 100;
    private readonly MIN_LIMIT = 1;

    createParams(page: number, limit: number):IPaginationParams {

        const validated = this.validatePaginationParams(page,limit);

        return {
            page: validated.page,
            limit: validated.limit,
            skip: (validated.page-1) * validated.limit,
            take: validated.limit,
        }
    }


    createResult<T>(data: T[], total: number, page: number, limit: number): IPaginationResult<T>{

        const totalPages =Math.ceil(total/limit)

        return {
           data,
           total,
           page,
           limit,
           totalPages,
           hasNextPage: page <totalPages,
           hasPreviousPage: page > 1 
        }
    }

    validatePaginationParams(page: number, limit: number): { page: number; limit: number; } {
        const validatedPage = Math.max(this.DEFAULT_PAGE,Math.floor(page) || this.DEFAULT_PAGE)
        const validatedLimit = Math.min(
            this.MAX_LIMIT,
            Math.max(this.MIN_LIMIT,Math.floor(limit) || this.DEFAULT_LIMIT)
        );

        return {
            page: validatedPage,
            limit: validatedLimit
        }
    }
}