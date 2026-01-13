import { Community } from '../../../../domain/entities/Community';
export interface IGetCommunitiesUseCase {
    execute(filters?: {
        category?: string;
    }, userId?: string): Promise<Community[]>;
}
//# sourceMappingURL=IGetCommunitiesUseCase.d.ts.map