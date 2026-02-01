import { Container } from 'inversify';
import { TYPES } from '../types';
import { IInterviewRepository } from '../../../domain/repositories/IInterviewRepository';
import { InterviewRepository } from '../../database/repositories/InterviewRepository';
import { IInterviewMapper } from '../../../application/mappers/interfaces/IInterviewMapper';
import { InterviewMapper } from '../../../application/mappers/InterviewMapper';
import { IScheduleInterviewUseCase } from '../../../application/useCases/interview/interfaces/IScheduleInterviewUseCase';
import { ScheduleInterviewUseCase } from '../../../application/useCases/interview/ScheduleInterviewUseCase';
import { IGetInterviewUseCase } from '../../../application/useCases/interview/interfaces/IGetInterviewUseCase';
import { GetInterviewUseCase } from '../../../application/useCases/interview/GetInterviewUseCase';
import { InterviewController } from '../../../presentation/controllers/interview/InterviewController';
import { InterviewRoutes } from '../../../presentation/routes/interview/InterviewRoutes';
import { InterviewScheduler } from '../../scheduler/InterviewScheduler';

export function registerInterviewBindings(container: Container): void {
    // Repository
    container.bind<IInterviewRepository>(TYPES.IInterviewRepository).to(InterviewRepository).inSingletonScope();

    // Mapper
    container.bind<IInterviewMapper>(TYPES.IInterviewMapper).to(InterviewMapper).inSingletonScope();

    // Use Cases
    container.bind<IScheduleInterviewUseCase>(TYPES.IScheduleInterviewUseCase).to(ScheduleInterviewUseCase).inSingletonScope();
    container.bind<IGetInterviewUseCase>(TYPES.IGetInterviewUseCase).to(GetInterviewUseCase).inSingletonScope();

    // Controller
    container.bind<InterviewController>(TYPES.InterviewController).to(InterviewController).inSingletonScope();

    // Routes
    // Routes
    container.bind<InterviewRoutes>(TYPES.InterviewRoutes).to(InterviewRoutes).inSingletonScope();

    // Scheduler
    container.bind<InterviewScheduler>(TYPES.InterviewScheduler).to(InterviewScheduler).inSingletonScope();
}
