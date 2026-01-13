"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindBookingModule = void 0;
const types_1 = require("../types");
const CreateBookingUseCase_1 = require("../../../application/useCases/booking/CreateBookingUseCase");
const AcceptBookingUseCase_1 = require("../../../application/useCases/booking/AcceptBookingUseCase");
const DeclineBookingUseCase_1 = require("../../../application/useCases/booking/DeclineBookingUseCase");
const CancelBookingUseCase_1 = require("../../../application/useCases/booking/CancelBookingUseCase");
const GetMyBookingsUseCase_1 = require("../../../application/useCases/booking/GetMyBookingsUseCase");
const GetUpcomingSessionsUseCase_1 = require("../../../application/useCases/booking/GetUpcomingSessionsUseCase");
const GetBookingByIdUseCase_1 = require("../../../application/useCases/booking/GetBookingByIdUseCase");
const RescheduleBookingUseCase_1 = require("../../../application/useCases/booking/RescheduleBookingUseCase");
const AcceptRescheduleUseCase_1 = require("../../../application/useCases/booking/AcceptRescheduleUseCase");
const DeclineRescheduleUseCase_1 = require("../../../application/useCases/booking/DeclineRescheduleUseCase");
const GetProviderBookingsUseCase_1 = require("../../../application/useCases/booking/GetProviderBookingsUseCase");
const SessionManagementController_1 = require("../../../presentation/controllers/SessionManagementController");
const BookingController_1 = require("../../../presentation/controllers/BookingController");
const bookingRoutes_1 = require("../../../presentation/routes/bookingRoutes");
const GetProviderAvailabilityUseCase_1 = require("../../../application/useCases/availability/GetProviderAvailabilityUseCase");
const UpdateProviderAvailabilityUseCase_1 = require("../../../application/useCases/availability/UpdateProviderAvailabilityUseCase");
const GetOccupiedSlotsUseCase_1 = require("../../../application/useCases/availability/GetOccupiedSlotsUseCase");
const AvailabilityController_1 = require("../../../presentation/controllers/availability/AvailabilityController");
const availabilityRoutes_1 = require("../../../presentation/routes/availability/availabilityRoutes");
const CreateProjectUseCase_1 = require("../../../application/useCases/project/CreateProjectUseCase");
const ListProjectsUseCase_1 = require("../../../application/useCases/project/ListProjectsUseCase");
const ProjectController_1 = require("../../../presentation/controllers/ProjectController");
const projectRoutes_1 = require("../../../presentation/routes/project/projectRoutes");
/**
 * Binds all booking, availability, and project-related use cases, controllers, and routes
 */
const bindBookingModule = (container) => {
    // Booking Use Cases
    container.bind(types_1.TYPES.ICreateBookingUseCase).to(CreateBookingUseCase_1.CreateBookingUseCase);
    container.bind(types_1.TYPES.IAcceptBookingUseCase).to(AcceptBookingUseCase_1.AcceptBookingUseCase);
    container.bind(types_1.TYPES.IDeclineBookingUseCase).to(DeclineBookingUseCase_1.DeclineBookingUseCase);
    container.bind(types_1.TYPES.ICancelBookingUseCase).to(CancelBookingUseCase_1.CancelBookingUseCase);
    container.bind(types_1.TYPES.IGetMyBookingsUseCase).to(GetMyBookingsUseCase_1.GetMyBookingsUseCase);
    container.bind(types_1.TYPES.IGetUpcomingSessionsUseCase).to(GetUpcomingSessionsUseCase_1.GetUpcomingSessionsUseCase);
    container.bind(types_1.TYPES.IGetBookingByIdUseCase).to(GetBookingByIdUseCase_1.GetBookingByIdUseCase);
    container.bind(types_1.TYPES.IRescheduleBookingUseCase).to(RescheduleBookingUseCase_1.RescheduleBookingUseCase);
    container.bind(types_1.TYPES.IAcceptRescheduleUseCase).to(AcceptRescheduleUseCase_1.AcceptRescheduleUseCase);
    container.bind(types_1.TYPES.IDeclineRescheduleUseCase).to(DeclineRescheduleUseCase_1.DeclineRescheduleUseCase);
    container.bind(types_1.TYPES.IGetProviderBookingsUseCase).to(GetProviderBookingsUseCase_1.GetProviderBookingsUseCase);
    // Availability Use Cases
    container.bind(types_1.TYPES.GetProviderAvailabilityUseCase).to(GetProviderAvailabilityUseCase_1.GetProviderAvailabilityUseCase);
    container.bind(types_1.TYPES.IGetProviderAvailabilityUseCase).to(GetProviderAvailabilityUseCase_1.GetProviderAvailabilityUseCase);
    container.bind(types_1.TYPES.UpdateProviderAvailabilityUseCase).to(UpdateProviderAvailabilityUseCase_1.UpdateProviderAvailabilityUseCase);
    container.bind(types_1.TYPES.IUpdateProviderAvailabilityUseCase).to(UpdateProviderAvailabilityUseCase_1.UpdateProviderAvailabilityUseCase);
    container.bind(types_1.TYPES.GetOccupiedSlotsUseCase).to(GetOccupiedSlotsUseCase_1.GetOccupiedSlotsUseCase);
    container.bind(types_1.TYPES.IGetOccupiedSlotsUseCase).to(GetOccupiedSlotsUseCase_1.GetOccupiedSlotsUseCase);
    // Project Use Cases
    container.bind(types_1.TYPES.ICreateProjectUseCase).to(CreateProjectUseCase_1.CreateProjectUseCase);
    container.bind(types_1.TYPES.IListProjectsUseCase).to(ListProjectsUseCase_1.ListProjectsUseCase);
    // Controllers & Routes
    container.bind(types_1.TYPES.SessionManagementController).to(SessionManagementController_1.SessionManagementController);
    container.bind(types_1.TYPES.BookingController).to(BookingController_1.BookingController);
    container.bind(types_1.TYPES.BookingRoutes).to(bookingRoutes_1.BookingRoutes);
    container.bind(types_1.TYPES.AvailabilityController).to(AvailabilityController_1.AvailabilityController);
    container.bind(types_1.TYPES.AvailabilityRoutes).to(availabilityRoutes_1.AvailabilityRoutes);
    container.bind(types_1.TYPES.ProjectController).to(ProjectController_1.ProjectController);
    container.bind(types_1.TYPES.ProjectRoutes).to(projectRoutes_1.ProjectRoutes);
};
exports.bindBookingModule = bindBookingModule;
//# sourceMappingURL=booking.bindings.js.map