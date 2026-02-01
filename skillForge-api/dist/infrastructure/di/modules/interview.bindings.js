"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInterviewBindings = registerInterviewBindings;
const types_1 = require("../types");
const InterviewRepository_1 = require("../../database/repositories/InterviewRepository");
const InterviewMapper_1 = require("../../../application/mappers/InterviewMapper");
const ScheduleInterviewUseCase_1 = require("../../../application/useCases/interview/ScheduleInterviewUseCase");
const GetInterviewUseCase_1 = require("../../../application/useCases/interview/GetInterviewUseCase");
const InterviewController_1 = require("../../../presentation/controllers/interview/InterviewController");
const InterviewRoutes_1 = require("../../../presentation/routes/interview/InterviewRoutes");
const InterviewScheduler_1 = require("../../scheduler/InterviewScheduler");
function registerInterviewBindings(container) {
    // Repository
    container.bind(types_1.TYPES.IInterviewRepository).to(InterviewRepository_1.InterviewRepository).inSingletonScope();
    // Mapper
    container.bind(types_1.TYPES.IInterviewMapper).to(InterviewMapper_1.InterviewMapper).inSingletonScope();
    // Use Cases
    container.bind(types_1.TYPES.IScheduleInterviewUseCase).to(ScheduleInterviewUseCase_1.ScheduleInterviewUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IGetInterviewUseCase).to(GetInterviewUseCase_1.GetInterviewUseCase).inSingletonScope();
    // Controller
    container.bind(types_1.TYPES.InterviewController).to(InterviewController_1.InterviewController).inSingletonScope();
    // Routes
    // Routes
    container.bind(types_1.TYPES.InterviewRoutes).to(InterviewRoutes_1.InterviewRoutes).inSingletonScope();
    // Scheduler
    container.bind(types_1.TYPES.InterviewScheduler).to(InterviewScheduler_1.InterviewScheduler).inSingletonScope();
}
//# sourceMappingURL=interview.bindings.js.map