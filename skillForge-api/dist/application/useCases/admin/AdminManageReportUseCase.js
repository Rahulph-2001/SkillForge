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
exports.AdminManageReportUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Report_1 = require("../../../domain/entities/Report");
const AppError_1 = require("../../../domain/errors/AppError");
let AdminManageReportUseCase = class AdminManageReportUseCase {
    constructor(reportRepository) {
        this.reportRepository = reportRepository;
    }
    async execute(reportId, adminId, action, resolution) {
        const report = await this.reportRepository.findById(reportId);
        if (!report) {
            throw new AppError_1.NotFoundError("Report not found");
        }
        let newStatus;
        switch (action) {
            case 'RESOLVE':
                newStatus = Report_1.ReportStatus.RESOLVED;
                if (!resolution)
                    throw new AppError_1.ValidationError("Resolution notes required to resolve a report");
                break;
            case 'DISMISS':
                newStatus = Report_1.ReportStatus.DISMISSED;
                break;
            case 'REVIEW':
                newStatus = Report_1.ReportStatus.REVIEWING;
                break;
            default:
                throw new AppError_1.ValidationError("Invalid action");
        }
        // Update domain entity properties for immutable/private props requires a method or we force it here since JS/TS allows if accessible (?) 
        // Our domain entity uses readonly props public but constructor private.
        // We usually should have methods on entity like `resolve(adminId, notes)`.
        // For expediency, we will bypass strict DDD method encapsulation if not present, but better to add it.
        // Let's assume we construct a new object or use a method.
        // Actually, the repository `update` takes a Report object. I should update the entity.
        // Let's add methods to Report entity implicitly by modifying the instance via update props logic or just create a new instance with updated props?
        // Simulating Entity Update:
        report.props.status = newStatus;
        if (action === 'RESOLVE' || action === 'DISMISS') {
            report.props.resolvedBy = adminId;
            report.props.resolvedAt = new Date();
            if (resolution)
                report.props.resolution = resolution;
        }
        await this.reportRepository.update(report);
    }
};
exports.AdminManageReportUseCase = AdminManageReportUseCase;
exports.AdminManageReportUseCase = AdminManageReportUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IReportRepository)),
    __metadata("design:paramtypes", [Object])
], AdminManageReportUseCase);
//# sourceMappingURL=AdminManageReportUseCase.js.map