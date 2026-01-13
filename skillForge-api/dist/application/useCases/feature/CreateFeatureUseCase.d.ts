import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IFeatureMapper } from '../../mappers/interfaces/IFeatureMapper';
import { CreateFeatureDTO } from '../../dto/feature/CreateFeatureDTO';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
import { ICreateFeatureUseCase } from './interfaces/ICreateFeatureUseCase';
export declare class CreateFeatureUseCase implements ICreateFeatureUseCase {
    private featureRepository;
    private featureMapper;
    constructor(featureRepository: IFeatureRepository, featureMapper: IFeatureMapper);
    execute(dto: CreateFeatureDTO): Promise<FeatureResponseDTO>;
}
//# sourceMappingURL=CreateFeatureUseCase.d.ts.map