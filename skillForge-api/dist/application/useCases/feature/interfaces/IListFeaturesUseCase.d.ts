import { FeatureResponseDTO } from '../../../dto/feature/FeatureResponseDTO';
export interface ListFeaturesResult {
    features: FeatureResponseDTO[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
export interface IListFeaturesUseCase {
    execute(page?: number, limit?: number, search?: string, planId?: string, highlightedOnly?: boolean): Promise<FeatureResponseDTO[] | ListFeaturesResult>;
}
//# sourceMappingURL=IListFeaturesUseCase.d.ts.map