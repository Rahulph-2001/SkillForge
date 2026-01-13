"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationService = void 0;
const inversify_1 = require("inversify");
let PaginationService = class PaginationService {
    constructor() {
        this.DEFAULT_PAGE = 1;
        this.DEFAULT_LIMIT = 20;
        this.MAX_LIMIT = 100;
        this.MIN_LIMIT = 1;
    }
    createParams(page, limit) {
        const validated = this.validatePaginationParams(page, limit);
        return {
            page: validated.page,
            limit: validated.limit,
            skip: (validated.page - 1) * validated.limit,
            take: validated.limit,
        };
    }
    createResult(data, total, page, limit) {
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        };
    }
    validatePaginationParams(page, limit) {
        const validatedPage = Math.max(this.DEFAULT_PAGE, Math.floor(page) || this.DEFAULT_PAGE);
        const validatedLimit = Math.min(this.MAX_LIMIT, Math.max(this.MIN_LIMIT, Math.floor(limit) || this.DEFAULT_LIMIT));
        return {
            page: validatedPage,
            limit: validatedLimit
        };
    }
};
exports.PaginationService = PaginationService;
exports.PaginationService = PaginationService = __decorate([
    (0, inversify_1.injectable)()
], PaginationService);
//# sourceMappingURL=PaginationService.js.map