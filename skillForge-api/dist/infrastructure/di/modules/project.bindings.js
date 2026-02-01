"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindProjectModule = void 0;
const types_1 = require("../types");
const CreateProjectUseCase_1 = require("../../../application/useCases/project/CreateProjectUseCase");
const ListProjectsUseCase_1 = require("../../../application/useCases/project/ListProjectsUseCase");
const ProjectController_1 = require("../../../presentation/controllers/ProjectController");
const projectRoutes_1 = require("../../../presentation/routes/project/projectRoutes");
const ValidateProjectPostLimitUseCase_1 = require("../../../application/useCases/project/ValidateProjectPostLimitUseCase");
const IncrementProjectPostUsageUseCase_1 = require("../../../application/useCases/project/IncrementProjectPostUsageUseCase");
const GetProjectUseCase_1 = require("../../../application/useCases/project/GetProjectUseCase");
const GetMyProjectsUseCase_1 = require("../../../application/useCases/project/GetMyProjectsUseCase");
const GetContributingProjectsUseCase_1 = require("../../../application/useCases/project/GetContributingProjectsUseCase");
const RequestProjectCompletionUseCase_1 = require("../../../application/useCases/project/RequestProjectCompletionUseCase");
const ApproveProjectCompletionUseCase_1 = require("../../../application/useCases/project/ApproveProjectCompletionUseCase");
const RejectProjectCompletionUseCase_1 = require("../../../application/useCases/project/RejectProjectCompletionUseCase");
const ReviewProjectCompletionUseCase_1 = require("../../../application/useCases/project/ReviewProjectCompletionUseCase");
const bindProjectModule = (container) => {
    // Project Use Cases
    container.bind(types_1.TYPES.ICreateProjectUseCase).to(CreateProjectUseCase_1.CreateProjectUseCase);
    container.bind(types_1.TYPES.IListProjectsUseCase).to(ListProjectsUseCase_1.ListProjectsUseCase);
    container.bind(types_1.TYPES.IValidateProjectPostLimitUseCase).to(ValidateProjectPostLimitUseCase_1.ValidateProjectPostLimitUseCase);
    container.bind(types_1.TYPES.IIncrementProjectPostUsageUseCase).to(IncrementProjectPostUsageUseCase_1.IncrementProjectPostUsageUseCase);
    container.bind(types_1.TYPES.IGetProjectUseCase).to(GetProjectUseCase_1.GetProjectUseCase);
    container.bind(types_1.TYPES.GetMyProjectsUseCase).to(GetMyProjectsUseCase_1.GetMyProjectsUseCase);
    container.bind(types_1.TYPES.GetContributingProjectsUseCase).to(GetContributingProjectsUseCase_1.GetContributingProjectsUseCase);
    // Project Completion
    container.bind(types_1.TYPES.IRequestProjectCompletionUseCase).to(RequestProjectCompletionUseCase_1.RequestProjectCompletionUseCase);
    container.bind(types_1.TYPES.IApproveProjectCompletionUseCase).to(ApproveProjectCompletionUseCase_1.ApproveProjectCompletionUseCase);
    container.bind(types_1.TYPES.IRejectProjectCompletionUseCase).to(RejectProjectCompletionUseCase_1.RejectProjectCompletionUseCase);
    container.bind(types_1.TYPES.IReviewProjectCompletionUseCase).to(ReviewProjectCompletionUseCase_1.ReviewProjectCompletionUseCase);
    // Controllers & Routes
    container.bind(types_1.TYPES.ProjectController).to(ProjectController_1.ProjectController);
    container.bind(types_1.TYPES.ProjectRoutes).to(projectRoutes_1.ProjectRoutes);
};
exports.bindProjectModule = bindProjectModule;
//# sourceMappingURL=project.bindings.js.map