"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindAdminModule = void 0;
const types_1 = require("../types");
const ListUsersUseCase_1 = require("../../../application/useCases/admin/ListUsersUseCase");
const SuspendUserUseCase_1 = require("../../../application/useCases/admin/SuspendUserUseCase");
const UnsuspendUserUseCase_1 = require("../../../application/useCases/admin/UnsuspendUserUseCase");
const ListPendingSkillsUseCase_1 = require("../../../application/useCases/admin/ListPendingSkillsUseCase");
const ApproveSkillUseCase_1 = require("../../../application/useCases/admin/ApproveSkillUseCase");
const RejectSkillUseCase_1 = require("../../../application/useCases/admin/RejectSkillUseCase");
const GetAllSkillsUseCase_1 = require("../../../application/useCases/admin/GetAllSkillsUseCase");
const BlockSkillUseCase_1 = require("../../../application/useCases/admin/BlockSkillUseCase");
const UnblockSkillUseCase_1 = require("../../../application/useCases/admin/UnblockSkillUseCase");
const GetAdminWalletStatsUseCase_1 = require("../../../application/useCases/admin/GetAdminWalletStatsUseCase");
const GetWalletTransactionsUseCase_1 = require("../../../application/useCases/admin/GetWalletTransactionsUseCase");
const CreditAdminWalletUseCase_1 = require("../../../application/useCases/admin/CreditAdminWalletUseCase");
const AdminController_1 = require("../../../presentation/controllers/admin/AdminController");
const AdminSkillController_1 = require("../../../presentation/controllers/admin/AdminSkillController");
const AdminWalletController_1 = require("../../../presentation/controllers/admin/AdminWalletController");
const adminRoutes_1 = require("../../../presentation/routes/admin/adminRoutes");
const adminSkillRoutes_1 = require("../../../presentation/routes/admin/adminSkillRoutes");
const AdminWalletRoutes_1 = require("../../../presentation/routes/admin/AdminWalletRoutes");
/**
 * Binds all admin-related use cases, controllers, and routes
 */
const bindAdminModule = (container) => {
    // Admin User Management Use Cases
    container.bind(types_1.TYPES.IListUsersUseCase).to(ListUsersUseCase_1.ListUsersUseCase);
    container.bind(types_1.TYPES.SuspendUserUseCase).to(SuspendUserUseCase_1.SuspendUserUseCase);
    container.bind(types_1.TYPES.ISuspendUserUseCase).to(SuspendUserUseCase_1.SuspendUserUseCase);
    container.bind(types_1.TYPES.UnsuspendUserUseCase).to(UnsuspendUserUseCase_1.UnsuspendUserUseCase);
    container.bind(types_1.TYPES.IUnsuspendUserUseCase).to(UnsuspendUserUseCase_1.UnsuspendUserUseCase);
    // Admin Skill Management Use Cases
    container.bind(types_1.TYPES.IListPendingSkillsUseCase).to(ListPendingSkillsUseCase_1.ListPendingSkillsUseCase);
    container.bind(types_1.TYPES.IApproveSkillUseCase).to(ApproveSkillUseCase_1.ApproveSkillUseCase);
    container.bind(types_1.TYPES.IRejectSkillUseCase).to(RejectSkillUseCase_1.RejectSkillUseCase);
    container.bind(types_1.TYPES.IGetAllSkillsUseCase).to(GetAllSkillsUseCase_1.GetAllSkillsUseCase);
    container.bind(types_1.TYPES.IBlockSkillUseCase).to(BlockSkillUseCase_1.BlockSkillUseCase);
    container.bind(types_1.TYPES.IUnblockSkillUseCase).to(UnblockSkillUseCase_1.UnblockSkillUseCase);
    // Admin Wallet Use Cases
    container.bind(types_1.TYPES.IGetAdminWalletStatsUseCase).to(GetAdminWalletStatsUseCase_1.GetAdminWalletStatsUseCase);
    container.bind(types_1.TYPES.IGetWalletTransactionsUseCase).to(GetWalletTransactionsUseCase_1.GetWalletTransactionsUseCase);
    container.bind(types_1.TYPES.ICreditAdminWalletUseCase).to(CreditAdminWalletUseCase_1.CreditAdminWalletUseCase);
    // Controllers & Routes
    container.bind(types_1.TYPES.AdminController).to(AdminController_1.AdminController);
    container.bind(types_1.TYPES.AdminSkillController).to(AdminSkillController_1.AdminSkillController);
    container.bind(types_1.TYPES.AdminWalletController).to(AdminWalletController_1.AdminWalletController);
    container.bind(types_1.TYPES.AdminRoutes).to(adminRoutes_1.AdminRoutes);
    container.bind(types_1.TYPES.AdminSkillRoutes).to(adminSkillRoutes_1.AdminSkillRoutes);
    container.bind(types_1.TYPES.AdminWalletRoutes).to(AdminWalletRoutes_1.AdminWalletRoutes);
};
exports.bindAdminModule = bindAdminModule;
//# sourceMappingURL=admin.bindings.js.map