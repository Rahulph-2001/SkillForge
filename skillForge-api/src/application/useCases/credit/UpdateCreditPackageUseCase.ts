import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { ICreditPackageMapper } from '../../mappers/interfaces/ICreditPackageMapper';
import { IUpdateCreditPackageUseCase } from './interfaaces/IUpdateCreditPackageUseCase';
import { UpdateCreditPackageDTO ,CreditPackageResponseDTO} from '../../dto/credit/CreditPackageDTO';
import { NotFoundError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';



@injectable()
export class UpdateCreditPackageUseCase implements IUpdateCreditPackageUseCase {
    constructor(
        @inject(TYPES.ICreditPackageRepository) private repository: ICreditPackageRepository,
        @inject(TYPES.ICreditPackageMapper) private mapper: ICreditPackageMapper
    ) { }

    async execute(id: string, dto: UpdateCreditPackageDTO): Promise<CreditPackageResponseDTO> {
        const entity = await this.repository.findById(id);
        if (!entity) {
            throw new NotFoundError(ERROR_MESSAGES.CREDITS.PACKAGE_NOT_FOUND);
        }

        entity.update(dto);
        const updatedEntity = await this.repository.update(entity);
        return this.mapper.toResponseDTO(updatedEntity);
    }
}
