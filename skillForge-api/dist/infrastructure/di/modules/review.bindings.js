"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerReviewBindings = registerReviewBindings;
const types_1 = require("../types");
const ReviewRepository_1 = require("../../database/repositories/ReviewRepository");
const CreateReviewUseCase_1 = require("../../../application/useCases/review/CreateReviewUseCase");
const ReviewMapper_1 = require("../../../application/mappers/ReviewMapper");
const ReviewController_1 = require("../../../presentation/controllers/review/ReviewController");
const ReviewRoutes_1 = require("../../../presentation/routes/review/ReviewRoutes");
function registerReviewBindings(container) {
    container.bind(types_1.TYPES.IReviewRepository).to(ReviewRepository_1.ReviewRepository).inSingletonScope();
    container.bind(types_1.TYPES.ICreateReviewUseCase).to(CreateReviewUseCase_1.CreateReviewUseCase).inSingletonScope();
    container.bind(types_1.TYPES.IReviewMapper).to(ReviewMapper_1.ReviewMapper).inSingletonScope();
    container.bind(types_1.TYPES.ReviewController).to(ReviewController_1.ReviewController).inSingletonScope();
    container.bind(types_1.TYPES.ReviewRoutes).to(ReviewRoutes_1.ReviewRoutes).inSingletonScope();
}
//# sourceMappingURL=review.bindings.js.map