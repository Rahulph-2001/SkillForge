import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { GetProviderAvailabilityUseCase } from '../../../application/useCases/availability/GetProviderAvailabilityUseCase';
import { UpdateProviderAvailabilityUseCase } from '../../../application/useCases/availability/UpdateProviderAvailabilityUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';

import { GetOccupiedSlotsUseCase } from '../../../application/useCases/availability/GetOccupiedSlotsUseCase';

@injectable()
export class AvailabilityController {
    constructor(
        @inject(TYPES.GetProviderAvailabilityUseCase) private readonly getUseCase: GetProviderAvailabilityUseCase,
        @inject(TYPES.UpdateProviderAvailabilityUseCase) private readonly updateUseCase: UpdateProviderAvailabilityUseCase,
        @inject(TYPES.GetOccupiedSlotsUseCase) private readonly getOccupiedSlotsUseCase: GetOccupiedSlotsUseCase,
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
    ) { }

    async getAvailability(req: Request, res: Response): Promise<void> {
        try {
            const providerId = (req as any).user!.userId; // Assumes auth middleware populates user
            console.log('[AvailabilityController] GET /availability for provider', providerId);
            const availability = await this.getUseCase.execute(providerId);
            console.log('[AvailabilityController] GET result schedule keys', Object.keys(availability.weeklySchedule || {}));

            const response = this.responseBuilder.success(availability);
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            console.error('Error getting availability:', error);
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', 'Failed to retrieve availability');
            res.status(response.statusCode).json(response.body);
        }
    }

    async updateAvailability(req: Request, res: Response): Promise<void> {
        try {
            const providerId = (req as any).user!.userId;
            const data = req.body;
            console.log(`[AvailabilityController] PUT /availability for provider ${providerId}`, {
                timezone: data?.timezone,
                bufferTime: data?.bufferTime,
                minAdvanceBooking: data?.minAdvanceBooking,
                maxAdvanceBooking: data?.maxAdvanceBooking,
                weeklyScheduleKeys: data?.weeklySchedule ? Object.keys(data.weeklySchedule) : [],
            });
            const updated = await this.updateUseCase.execute(providerId, data);
            console.log('[AvailabilityController] PUT result schedule keys', Object.keys(updated.weeklySchedule || {}));

            const response = this.responseBuilder.success(updated, 'Availability settings updated successfully');
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            console.error('Error updating availability:', error);
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
            console.error('Error getting occupied slots:', error);
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', 'Failed to retrieve occupied slots');
            res.status(response.statusCode).json(response.body);
        }
    }
}
