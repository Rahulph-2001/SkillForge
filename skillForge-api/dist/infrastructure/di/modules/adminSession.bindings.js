"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindAdminSessionModule = void 0;
const types_1 = require("../types");
const AdminListSessionsUseCase_1 = require("../../../application/useCases/admin/session/AdminListSessionsUseCase");
const AdminGetSessionStatsUseCase_1 = require("../../../application/useCases/admin/session/AdminGetSessionStatsUseCase");
const AdminCancelSessionUseCase_1 = require("../../../application/useCases/admin/session/AdminCancelSessionUseCase");
const AdminCompleteSessionUseCase_1 = require("../../../application/useCases/admin/session/AdminCompleteSessionUseCase");
const AdminSessionController_1 = require("../../../presentation/controllers/admin/AdminSessionController");
const adminSessionRoutes_1 = require("../../../presentation/routes/admin/adminSessionRoutes");
const bindAdminSessionModule = (container) => {
    // Use Cases
    container.bind(types_1.TYPES.IAdminListSessionsUseCase).to(AdminListSessionsUseCase_1.AdminListSessionsUseCase);
    container.bind(types_1.TYPES.IAdminGetSessionStatsUseCase).to(AdminGetSessionStatsUseCase_1.AdminGetSessionStatsUseCase);
    container.bind(types_1.TYPES.IAdminCancelSessionUseCase).to(AdminCancelSessionUseCase_1.AdminCancelSessionUseCase);
    container.bind(types_1.TYPES.IAdminCompleteSessionUseCase).to(AdminCompleteSessionUseCase_1.AdminCompleteSessionUseCase);
    // Controller
    container.bind(types_1.TYPES.AdminSessionController).to(AdminSessionController_1.AdminSessionController);
    // Routes
    container.bind(types_1.TYPES.AdminSessionRoutes).to(adminSessionRoutes_1.AdminSessionRoutes);
};
exports.bindAdminSessionModule = bindAdminSessionModule;
//# sourceMappingURL=adminSession.bindings.js.map