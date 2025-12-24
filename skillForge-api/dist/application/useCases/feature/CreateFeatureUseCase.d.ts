import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { CreateFeatureDTO } from '../../dto/feature/CreateFeatureDTO';
import { FeatureResponseDTO } from '../../dto/feature/FeatureResponseDTO';
export interface ICreateFeatureUseCase {
    execute(dto: CreateFeatureDTO): Promise<FeatureResponseDTO>;
}
export declare class CreateFeatureUseCase implements ICreateFeatureUseCase {
    private featureRepository;
    constructor(featureRepository: IFeatureRepository);
    execute(dto: CreateFeatureDTO): Promise<FeatureResponseDTO>;
}
//# sourceMappingURL=CreateFeatureUseCase.d.ts.map