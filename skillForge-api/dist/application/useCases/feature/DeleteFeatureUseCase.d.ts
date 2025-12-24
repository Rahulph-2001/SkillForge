import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
export interface IDeleteFeatureUseCase {
    execute(featureId: string): Promise<void>;
}
export declare class DeleteFeatureUseCase implements IDeleteFeatureUseCase {
    private featureRepository;
    constructor(featureRepository: IFeatureRepository);
    execute(featureId: string): Promise<void>;
}
//# sourceMappingURL=DeleteFeatureUseCase.d.ts.map