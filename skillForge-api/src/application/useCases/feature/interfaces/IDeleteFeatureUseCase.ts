export interface IDeleteFeatureUseCase {
    execute(featureId: string): Promise<void>;
}

