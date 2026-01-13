import { FeatureResponseDTO } from '../../../dto/feature/FeatureResponseDTO';
export interface IGetFeatureByIdUseCase {
    execute(featureId: string): Promise<FeatureResponseDTO>;
}
//# sourceMappingURL=IGetFeatureByIdUseCase.d.ts.map