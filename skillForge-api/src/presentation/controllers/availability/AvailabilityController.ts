import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { GetProviderAvailabilityUseCase } from '../../../application/useCases/availability/GetProviderAvailabilityUseCase';
import { UpdateProviderAvailabilityUseCase } from '../../../application/useCases/availability/UpdateProviderAvailabilityUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';

@injectable()
export class AvailabilityController {
    constructor(
        @inject(TYPES.GetProviderAvailabilityUseCase) private readonly getUseCase: GetProviderAvailabilityUseCase,
        @inject(TYPES.UpdateProviderAvailabilityUseCase) private readonly updateUseCase: UpdateProviderAvailabilityUseCase,
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
    ) { }

    async getAvailability(req: Request, res: Response): Promise<void> {
        try {
            const providerId = (req as any).user!.userId; // Assumes auth middleware populates user
            const availability = await this.getUseCase.execute(providerId);
            res.status(200).json(this.responseBuilder.success(availability));
        } catch (error) {
            console.error('Error getting availability:', error);
            res.status(500).json(this.responseBuilder.error('INTERNAL_SERVER_ERROR', 'Failed to retrieve availability'));
        }
    }

    async updateAvailability(req: Request, res: Response): Promise<void> {
        try {
            const providerId = (req as any).user!.userId;
            const data = req.body;
            console.log(`[AvailabilityController] Updating availability for provider ${providerId}:`, JSON.stringify(data, null, 2));
            const updated = await this.updateUseCase.execute(providerId, data);
            res.status(200).json(this.responseBuilder.success(updated, 'Availability settings updated successfully'));
        } catch (error) {
            console.error('Error updating availability:', error);
            res.status(500).json(this.responseBuilder.error('INTERNAL_SERVER_ERROR', 'Failed to update availability'));
        }
    }
}
