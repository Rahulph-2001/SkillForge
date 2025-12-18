import { Request, Response } from 'express';
import { GetProviderAvailabilityUseCase } from '../../../application/useCases/availability/GetProviderAvailabilityUseCase';
import { UpdateProviderAvailabilityUseCase } from '../../../application/useCases/availability/UpdateProviderAvailabilityUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { GetOccupiedSlotsUseCase } from '../../../application/useCases/availability/GetOccupiedSlotsUseCase';
export declare class AvailabilityController {
    private readonly getUseCase;
    private readonly updateUseCase;
    private readonly getOccupiedSlotsUseCase;
    private readonly responseBuilder;
    constructor(getUseCase: GetProviderAvailabilityUseCase, updateUseCase: UpdateProviderAvailabilityUseCase, getOccupiedSlotsUseCase: GetOccupiedSlotsUseCase, responseBuilder: IResponseBuilder);
    getAvailability(req: Request, res: Response): Promise<void>;
    updateAvailability(req: Request, res: Response): Promise<void>;
    getOccupiedSlots(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AvailabilityController.d.ts.map