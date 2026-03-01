import { type Container } from 'inversify';
import { TYPES } from '../types';
import { CreateBookingUseCase } from '../../../application/useCases/booking/CreateBookingUseCase';
import { type ICreateBookingUseCase } from '../../../application/useCases/booking/interfaces/ICreateBookingUseCase';
import { AcceptBookingUseCase } from '../../../application/useCases/booking/AcceptBookingUseCase';
import { type IAcceptBookingUseCase } from '../../../application/useCases/booking/interfaces/IAcceptBookingUseCase';
import { DeclineBookingUseCase } from '../../../application/useCases/booking/DeclineBookingUseCase';
import { type IDeclineBookingUseCase } from '../../../application/useCases/booking/interfaces/IDeclineBookingUseCase';
import { CancelBookingUseCase } from '../../../application/useCases/booking/CancelBookingUseCase';
import { type ICancelBookingUseCase } from '../../../application/useCases/booking/interfaces/ICancelBookingUseCase';
import { GetMyBookingsUseCase } from '../../../application/useCases/booking/GetMyBookingsUseCase';
import { type IGetMyBookingsUseCase } from '../../../application/useCases/booking/interfaces/IGetMyBookingsUseCase';
import { GetUpcomingSessionsUseCase } from '../../../application/useCases/booking/GetUpcomingSessionsUseCase';
import { type IGetUpcomingSessionsUseCase } from '../../../application/useCases/booking/interfaces/IGetUpcomingSessionsUseCase';
import { GetBookingByIdUseCase } from '../../../application/useCases/booking/GetBookingByIdUseCase';
import { type IGetBookingByIdUseCase } from '../../../application/useCases/booking/interfaces/IGetBookingByIdUseCase';
import { RescheduleBookingUseCase } from '../../../application/useCases/booking/RescheduleBookingUseCase';
import { type IRescheduleBookingUseCase } from '../../../application/useCases/booking/interfaces/IRescheduleBookingUseCase';
import { AcceptRescheduleUseCase } from '../../../application/useCases/booking/AcceptRescheduleUseCase';
import { type IAcceptRescheduleUseCase } from '../../../application/useCases/booking/interfaces/IAcceptRescheduleUseCase';
import { DeclineRescheduleUseCase } from '../../../application/useCases/booking/DeclineRescheduleUseCase';
import { type IDeclineRescheduleUseCase } from '../../../application/useCases/booking/interfaces/IDeclineRescheduleUseCase';
import { GetProviderBookingsUseCase } from '../../../application/useCases/booking/GetProviderBookingsUseCase';
import { type IGetProviderBookingsUseCase } from '../../../application/useCases/booking/interfaces/IGetProviderBookingsUseCase';
import { CompleteSessionUseCase } from '../../../application/useCases/booking/CompleteSessionUseCase';
import { type ICompleteSessionUseCase } from '../../../application/useCases/booking/interfaces/ICompleteSessionUseCase';
import { SessionManagementController } from '../../../presentation/controllers/SessionManagementController';
import { BookingController } from '../../../presentation/controllers/BookingController';
import { BookingRoutes } from '../../../presentation/routes/bookingRoutes';
import { GetProviderAvailabilityUseCase } from '../../../application/useCases/availability/GetProviderAvailabilityUseCase';
import { type IGetProviderAvailabilityUseCase } from '../../../application/useCases/availability/interfaces/IGetProviderAvailabilityUseCase';
import { UpdateProviderAvailabilityUseCase } from '../../../application/useCases/availability/UpdateProviderAvailabilityUseCase';
import { type IUpdateProviderAvailabilityUseCase } from '../../../application/useCases/availability/interfaces/IUpdateProviderAvailabilityUseCase';
import { GetOccupiedSlotsUseCase } from '../../../application/useCases/availability/GetOccupiedSlotsUseCase';
import { type IGetOccupiedSlotsUseCase } from '../../../application/useCases/availability/interfaces/IGetOccupiedSlotsUseCase';
import { AvailabilityController } from '../../../presentation/controllers/availability/AvailabilityController';
import { AvailabilityRoutes } from '../../../presentation/routes/availability/availabilityRoutes';

export const bindBookingModule = (container: Container): void => {
  // Booking Use Cases
  container.bind<ICreateBookingUseCase>(TYPES.ICreateBookingUseCase).to(CreateBookingUseCase);
  container.bind<IAcceptBookingUseCase>(TYPES.IAcceptBookingUseCase).to(AcceptBookingUseCase);
  container.bind<IDeclineBookingUseCase>(TYPES.IDeclineBookingUseCase).to(DeclineBookingUseCase);
  container.bind<ICancelBookingUseCase>(TYPES.ICancelBookingUseCase).to(CancelBookingUseCase);
  container.bind<IGetMyBookingsUseCase>(TYPES.IGetMyBookingsUseCase).to(GetMyBookingsUseCase);
  container.bind<IGetUpcomingSessionsUseCase>(TYPES.IGetUpcomingSessionsUseCase).to(GetUpcomingSessionsUseCase);
  container.bind<IGetBookingByIdUseCase>(TYPES.IGetBookingByIdUseCase).to(GetBookingByIdUseCase);
  container.bind<IRescheduleBookingUseCase>(TYPES.IRescheduleBookingUseCase).to(RescheduleBookingUseCase);
  container.bind<IAcceptRescheduleUseCase>(TYPES.IAcceptRescheduleUseCase).to(AcceptRescheduleUseCase);
  container.bind<IDeclineRescheduleUseCase>(TYPES.IDeclineRescheduleUseCase).to(DeclineRescheduleUseCase);
  container.bind<IGetProviderBookingsUseCase>(TYPES.IGetProviderBookingsUseCase).to(GetProviderBookingsUseCase);
  
  // Complete Session Use Case (Escrow Release)
  container.bind<ICompleteSessionUseCase>(TYPES.ICompleteSessionUseCase).to(CompleteSessionUseCase);

  // Availability Use Cases
  container.bind<GetProviderAvailabilityUseCase>(TYPES.GetProviderAvailabilityUseCase).to(GetProviderAvailabilityUseCase);
  container.bind<IGetProviderAvailabilityUseCase>(TYPES.IGetProviderAvailabilityUseCase).to(GetProviderAvailabilityUseCase);
  container.bind<UpdateProviderAvailabilityUseCase>(TYPES.UpdateProviderAvailabilityUseCase).to(UpdateProviderAvailabilityUseCase);
  container.bind<IUpdateProviderAvailabilityUseCase>(TYPES.IUpdateProviderAvailabilityUseCase).to(UpdateProviderAvailabilityUseCase);
  container.bind<GetOccupiedSlotsUseCase>(TYPES.GetOccupiedSlotsUseCase).to(GetOccupiedSlotsUseCase);
  container.bind<IGetOccupiedSlotsUseCase>(TYPES.IGetOccupiedSlotsUseCase).to(GetOccupiedSlotsUseCase);

  // Controllers & Routes
  container.bind<SessionManagementController>(TYPES.SessionManagementController).to(SessionManagementController);
  container.bind<BookingController>(TYPES.BookingController).to(BookingController);
  container.bind<BookingRoutes>(TYPES.BookingRoutes).to(BookingRoutes);
  container.bind<AvailabilityController>(TYPES.AvailabilityController).to(AvailabilityController);
  container.bind<AvailabilityRoutes>(TYPES.AvailabilityRoutes).to(AvailabilityRoutes);
};