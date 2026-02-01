"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProjectApplicationBindings = registerProjectApplicationBindings;
const types_1 = require("../types");
// Use Cases
const ApplyToProjectUseCase_1 = require("../../../application/useCases/projectApplication/ApplyToProjectUseCase");
const GetProjectApplicationsUseCase_1 = require("../../../application/useCases/projectApplication/GetProjectApplicationsUseCase");
const UpdateApplicationStatusUseCase_1 = require("../../../application/useCases/projectApplication/UpdateApplicationStatusUseCase");
const GetMyApplicationsUseCase_1 = require("../../../application/useCases/projectApplication/GetMyApplicationsUseCase");
const WithdrawApplicationUseCase_1 = require("../../../application/useCases/projectApplication/WithdrawApplicationUseCase");
const GetReceivedApplicationsUseCase_1 = require("../../../application/useCases/projectApplication/GetReceivedApplicationsUseCase");
// Controllers
const ProjectApplicationController_1 = require("../../../presentation/controllers/projectApplication/ProjectApplicationController");
// Routes
const ProjectApplicationRoutes_1 = require("../../../presentation/routes/projectApplication/ProjectApplicationRoutes");
const ProjectApplicationRepository_1 = require("../../database/repositories/ProjectApplicationRepository");
const ProjectApplicationMapper_1 = require("../../../application/mappers/ProjectApplicationMapper");
const GeminiAIService_1 = require("../../services/GeminiAIService");
function registerProjectApplicationBindings(container) {
    // Use Cases
    container.bind(types_1.TYPES.IApplyToProjectUseCase).to(ApplyToProjectUseCase_1.ApplyToProjectUseCase);
    container.bind(types_1.TYPES.IGetProjectApplicationsUseCase).to(GetProjectApplicationsUseCase_1.GetProjectApplicationsUseCase);
    container.bind(types_1.TYPES.IUpdateApplicationStatusUseCase).to(UpdateApplicationStatusUseCase_1.UpdateApplicationStatusUseCase);
    container.bind(types_1.TYPES.IGetMyApplicationsUseCase).to(GetMyApplicationsUseCase_1.GetMyApplicationsUseCase);
    container.bind(types_1.TYPES.IWithdrawApplicationUseCase).to(WithdrawApplicationUseCase_1.WithdrawApplicationUseCase);
    container.bind(types_1.TYPES.GetReceivedApplicationsUseCase).to(GetReceivedApplicationsUseCase_1.GetReceivedApplicationsUseCase);
    // Controller
    container.bind(types_1.TYPES.ProjectApplicationController).to(ProjectApplicationController_1.ProjectApplicationController);
    // Repository
    container.bind(types_1.TYPES.IProjectApplicationRepository).to(ProjectApplicationRepository_1.ProjectApplicationRepository);
    // Mapper
    container.bind(types_1.TYPES.IProjectApplicationMapper).to(ProjectApplicationMapper_1.ProjectApplicationMapper);
    // Services
    container.bind(types_1.TYPES.IGeminiAIService).to(GeminiAIService_1.GeminiAIService);
    // Routes
    container.bind(types_1.TYPES.ProjectApplicationRoutes).to(ProjectApplicationRoutes_1.ProjectApplicationRoutes);
}
//# sourceMappingURL=projectApplication.bindings.js.map