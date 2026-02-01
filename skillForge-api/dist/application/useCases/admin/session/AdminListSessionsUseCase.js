"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminListSessionsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../../infrastructure/di/types");
let AdminListSessionsUseCase = class AdminListSessionsUseCase {
    constructor(bookingRepository, paginationService, bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.paginationService = paginationService;
        this.bookingMapper = bookingMapper;
    }
    async execute(page, limit, search) {
        const { page: validatedPage, limit: validatedLimit } = this.paginationService.createParams(page, limit);
        // Repository method returns { data: Booking[], total: number }
        const { data, total } = await this.bookingRepository.listAll(validatedPage, validatedLimit, search);
        // Map Domain Entities to DTOs
        const dtos = this.bookingMapper.toDTOs(data);
        return this.paginationService.createResult(dtos, total, validatedPage, validatedLimit);
    }
};
exports.AdminListSessionsUseCase = AdminListSessionsUseCase;
exports.AdminListSessionsUseCase = AdminListSessionsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IPaginationService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBookingMapper)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminListSessionsUseCase);
//# sourceMappingURL=AdminListSessionsUseCase.js.map