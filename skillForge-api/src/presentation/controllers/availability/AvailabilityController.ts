import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetProviderAvailabilityUseCase } from '../../../application/useCases/availability/interfaces/IGetProviderAvailabilityUseCase';
import { IUpdateProviderAvailabilityUseCase } from '../../../application/useCases/availability/interfaces/IUpdateProviderAvailabilityUseCase';
import { IGetOccupiedSlotsUseCase } from '../../../application/useCases/availability/interfaces/IGetOccupiedSlotsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';

@injectable()
export class AvailabilityController {
    constructor(
        @inject(TYPES.IGetProviderAvailabilityUseCase) private readonly getUseCase: IGetProviderAvailabilityUseCase,
        @inject(TYPES.IUpdateProviderAvailabilityUseCase) private readonly updateUseCase: IUpdateProviderAvailabilityUseCase,
        @inject(TYPES.IGetOccupiedSlotsUseCase) private readonly getOccupiedSlotsUseCase: IGetOccupiedSlotsUseCase,
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
    ) { }

    async getAvailability(req: Request, res: Response): Promise<void> {
        try {
            const providerId = req.user!.userId;
            const availability = await this.getUseCase.execute(providerId);

            const response = this.responseBuilder.success(availability);
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', 'Failed to retrieve availability');
            res.status(response.statusCode).json(response.body);
        }
    }

    async updateAvailability(req: Request, res: Response): Promise<void> {
        try {
            const providerId = req.user!.userId;
            const data = req.body;
            const updated = await this.updateUseCase.execute(providerId, data);

            const response = this.responseBuilder.success(updated, 'Availability settings updated successfully');
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', 'Failed to update availability');
            res.status(response.statusCode).json(response.body);
        }
    }

    async getOccupiedSlots(req: Request, res: Response): Promise<void> {
        try {
            const { providerId } = req.params;
            const { start, end } = req.query;

            if (!start || !end) {
                const response = this.responseBuilder.error('BAD_REQUEST', 'Start and end dates are required');
                res.status(response.statusCode).json(response.body);
                return;
            }

            const slots = await this.getOccupiedSlotsUseCase.execute(
                providerId,
                start as string,
                end as string
            );

            const response = this.responseBuilder.success(slots);
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', 'Failed to retrieve occupied slots');
            res.status(response.statusCode).json(response.body);
        }
    }
}
