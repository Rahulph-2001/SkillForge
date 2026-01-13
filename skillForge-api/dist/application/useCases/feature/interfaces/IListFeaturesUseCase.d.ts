import { FeatureResponseDTO } from '../../../dto/feature/FeatureResponseDTO';
export interface IListFeaturesUseCase {
    execute(planId?: string, highlightedOnly?: boolean): Promise<FeatureResponseDTO[]>;
}
//# sourceMappingURL=IListFeaturesUseCase.d.ts.map