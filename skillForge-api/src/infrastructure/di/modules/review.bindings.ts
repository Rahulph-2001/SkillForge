import { Container } from 'inversify';
import { TYPES } from '../types';
import { IReviewRepository } from '../../../domain/repositories/IReviewRepository';
import { ReviewRepository } from '../../database/repositories/ReviewRepository';
import { ICreateReviewUseCase } from '../../../application/useCases/review/interfaces/ICreateReviewUseCase';
import { CreateReviewUseCase } from '../../../application/useCases/review/CreateReviewUseCase';
import { IReviewMapper } from '../../../application/mappers/ReviewMapper';
import { ReviewMapper } from '../../../application/mappers/ReviewMapper';
import { ReviewController } from '../../../presentation/controllers/review/ReviewController';
import { ReviewRoutes } from '../../../presentation/routes/review/ReviewRoutes';

export function registerReviewBindings(container: Container): void {
    container.bind<IReviewRepository>(TYPES.IReviewRepository).to(ReviewRepository).inSingletonScope();
    container.bind<ICreateReviewUseCase>(TYPES.ICreateReviewUseCase).to(CreateReviewUseCase).inSingletonScope();
    container.bind<IReviewMapper>(TYPES.IReviewMapper).to(ReviewMapper).inSingletonScope();
    container.bind<ReviewController>(TYPES.ReviewController).to(ReviewController).inSingletonScope();
    container.bind<ReviewRoutes>(TYPES.ReviewRoutes).to(ReviewRoutes).inSingletonScope();
}
