"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindReportModule = void 0;
const types_1 = require("../types");
const PrismaReportRepository_1 = require("../../../infrastructure/database/repositories/PrismaReportRepository");
const AdminListReportsUseCase_1 = require("../../../application/useCases/admin/AdminListReportsUseCase");
const AdminManageReportUseCase_1 = require("../../../application/useCases/admin/AdminManageReportUseCase");
const CreateReportUseCase_1 = require("../../../application/useCases/report/CreateReportUseCase");
const AdminReportController_1 = require("../../../presentation/controllers/admin/AdminReportController");
const ReportController_1 = require("../../../presentation/controllers/ReportController");
const AdminReportRoutes_1 = require("../../../presentation/routes/admin/AdminReportRoutes");
const ReportRoutes_1 = require("../../../presentation/routes/ReportRoutes");
const bindReportModule = (container) => {
    // Repositories
    container.bind(types_1.TYPES.IReportRepository).to(PrismaReportRepository_1.PrismaReportRepository);
    // Use Cases
    container.bind(types_1.TYPES.IAdminListReportsUseCase).to(AdminListReportsUseCase_1.AdminListReportsUseCase);
    container.bind(types_1.TYPES.IAdminManageReportUseCase).to(AdminManageReportUseCase_1.AdminManageReportUseCase);
    container.bind(types_1.TYPES.ICreateReportUseCase).to(CreateReportUseCase_1.CreateReportUseCase);
    // Controllers
    container.bind(types_1.TYPES.AdminReportController).to(AdminReportController_1.AdminReportController);
    container.bind(types_1.TYPES.ReportController).to(ReportController_1.ReportController);
    // Routes
    container.bind(types_1.TYPES.AdminReportRoutes).to(AdminReportRoutes_1.AdminReportRoutes);
    container.bind(types_1.TYPES.ReportRoutes).to(ReportRoutes_1.ReportRoutes);
};
exports.bindReportModule = bindReportModule;
//# sourceMappingURL=report.bindings.js.map