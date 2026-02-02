"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectPaymentRequestBindings = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const ProjectPaymentRequestRepository_1 = require("../../database/repositories/ProjectPaymentRequestRepository");
const DebitAdminWalletUseCase_1 = require("../../../application/useCases/admin/DebitAdminWalletUseCase");
const ProcessProjectPaymentRequestUseCase_1 = require("../../../application/useCases/admin/ProcessProjectPaymentRequestUseCase");
const GetPendingPaymentRequestsUseCase_1 = require("../../../application/useCases/admin/GetPendingPaymentRequestsUseCase");
const ProjectPaymentRequestController_1 = require("../../../presentation/controllers/admin/ProjectPaymentRequestController");
exports.projectPaymentRequestBindings = new inversify_1.ContainerModule((bind) => {
    // Repositories
    bind(types_1.TYPES.IProjectPaymentRequestRepository).to(ProjectPaymentRequestRepository_1.ProjectPaymentRequestRepository).inSingletonScope();
    // Use Cases
    bind(types_1.TYPES.IDebitAdminWalletUseCase).to(DebitAdminWalletUseCase_1.DebitAdminWalletUseCase).inTransientScope();
    bind(types_1.TYPES.IProcessProjectPaymentRequestUseCase).to(ProcessProjectPaymentRequestUseCase_1.ProcessProjectPaymentRequestUseCase).inTransientScope();
    bind(types_1.TYPES.IGetPendingPaymentRequestsUseCase).to(GetPendingPaymentRequestsUseCase_1.GetPendingPaymentRequestsUseCase).inTransientScope();
    // Controllers
    bind(types_1.TYPES.ProjectPaymentRequestController).to(ProjectPaymentRequestController_1.ProjectPaymentRequestController).inTransientScope();
});
//# sourceMappingURL=projectPaymentRequest.bindings.js.map