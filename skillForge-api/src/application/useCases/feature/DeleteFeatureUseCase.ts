import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { NotFoundError, ConflictError } from '../../../domain/errors/AppError';

export interface IDeleteFeatureUseCase {
    execute(featureId: string): Promise<void>;
}

@injectable()
export class DeleteFeatureUseCase implements IDeleteFeatureUseCase {
    constructor(
        @inject(TYPES.IFeatureRepository) private featureRepository: IFeatureRepository
    ) { }

    async execute(featureId: string): Promise<void> {
        // Find existing feature
        const feature = await this.featureRepository.findById(featureId);

        if (!feature) {
            throw new NotFoundError('Feature not found');
        }

        // Check if feature is in use by any plans
        // Note: In a real implementation, you might want to check if the feature
        // is linked to any active subscription plans before deleting
        // For now, we'll do a soft delete by disabling it

        feature.disable();

        // Update to mark as disabled (soft delete)
        await this.featureRepository.update(feature);

        // Or hard delete if preferred:
        // await this.featureRepository.delete(featureId);
    }
}
