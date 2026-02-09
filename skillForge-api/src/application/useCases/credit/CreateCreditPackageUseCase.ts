import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { ICreditPackageMapper } from '../../mappers/interfaces/ICreditPackageMapper';
import { CreateCreditPackageDTO, CreditPackageResponseDTO } from '../../dto/credit/CreditPackageDTO';
import { CreditPackage } from '../../../domain/entities/CreditPackage';

export interface ICreateCreditPackageUseCase {
    execute(dto: CreateCreditPackageDTO): Promise<CreditPackageResponseDTO>;
}

@injectable()
export class CreateCreditPackageUseCase implements ICreateCreditPackageUseCase {
    constructor(
        @inject(TYPES.ICreditPackageRepository) private repository: ICreditPackageRepository,
        @inject(TYPES.ICreditPackageMapper) private mapper: ICreditPackageMapper
    ) { }

    async execute(dto: CreateCreditPackageDTO): Promise<CreditPackageResponseDTO> {
        const entity = new CreditPackage({
            credits: dto.credits,
            price: dto.price,
            isPopular: dto.isPopular,
            isActive: dto.isActive,
            // discount is defaulted to 0 in entity
        });

        const savedEntity = await this.repository.create(entity);
        return this.mapper.toResponseDTO(savedEntity);
    }
}
