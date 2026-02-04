"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectChatBindings = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const ProjectMessageRepository_1 = require("../../database/repositories/ProjectMessageRepository");
const ProjectMessageMapper_1 = require("../../../application/mappers/ProjectMessageMapper");
const SendProjectMessageUseCase_1 = require("../../../application/useCases/project/SendProjectMessageUseCase");
const GetProjectMessagesUseCase_1 = require("../../../application/useCases/project/GetProjectMessagesUseCase");
const ProjectMessageController_1 = require("../../../presentation/controllers/project/ProjectMessageController");
const ProjectMessageRoutes_1 = require("../../../presentation/routes/project/ProjectMessageRoutes");
exports.projectChatBindings = new inversify_1.ContainerModule((bind) => {
    // Repository
    bind(types_1.TYPES.IProjectMessageRepository).to(ProjectMessageRepository_1.ProjectMessageRepository).inSingletonScope();
    // Mapper
    bind(types_1.TYPES.IProjectMessageMapper).to(ProjectMessageMapper_1.ProjectMessageMapper).inSingletonScope();
    // Use Cases
    bind(types_1.TYPES.ISendProjectMessageUseCase).to(SendProjectMessageUseCase_1.SendProjectMessageUseCase).inTransientScope();
    bind(types_1.TYPES.IGetProjectMessagesUseCase).to(GetProjectMessagesUseCase_1.GetProjectMessagesUseCase).inTransientScope();
    // Controller
    bind(types_1.TYPES.ProjectMessageController).to(ProjectMessageController_1.ProjectMessageController).inSingletonScope();
    // Routes
    bind(types_1.TYPES.ProjectMessageRoutes).to(ProjectMessageRoutes_1.ProjectMessageRoutes).inSingletonScope();
});
//# sourceMappingURL=project_chat.bindings.js.map