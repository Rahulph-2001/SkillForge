import { Request, Response } from 'express';
import { IGetProviderAvailabilityUseCase } from '../../../application/useCases/availability/interfaces/IGetProviderAvailabilityUseCase';
import { IUpdateProviderAvailabilityUseCase } from '../../../application/useCases/availability/interfaces/IUpdateProviderAvailabilityUseCase';
import { IGetOccupiedSlotsUseCase } from '../../../application/useCases/availability/interfaces/IGetOccupiedSlotsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class AvailabilityController {
    private readonly getUseCase;
    private readonly updateUseCase;
    private readonly getOccupiedSlotsUseCase;
    private readonly responseBuilder;
    constructor(getUseCase: IGetProviderAvailabilityUseCase, updateUseCase: IUpdateProviderAvailabilityUseCase, getOccupiedSlotsUseCase: IGetOccupiedSlotsUseCase, responseBuilder: IResponseBuilder);
    getAvailability(req: Request, res: Response): Promise<void>;
    updateAvailability(req: Request, res: Response): Promise<void>;
    getOccupiedSlots(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AvailabilityController.d.ts.map