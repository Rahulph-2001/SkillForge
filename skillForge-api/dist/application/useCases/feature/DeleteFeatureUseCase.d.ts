import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IDeleteFeatureUseCase } from './interfaces/IDeleteFeatureUseCase';
export declare class DeleteFeatureUseCase implements IDeleteFeatureUseCase {
    private featureRepository;
    constructor(featureRepository: IFeatureRepository);
    execute(featureId: string): Promise<void>;
}
//# sourceMappingURL=DeleteFeatureUseCase.d.ts.map