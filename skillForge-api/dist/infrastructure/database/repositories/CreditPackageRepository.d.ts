import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { CreditPackage } from '../../../domain/entities/CreditPackage';
export declare class CreditPackageRepository extends BaseRepository<CreditPackage> implements ICreditPackageRepository {
    constructor(db: Database);
    create(entity: CreditPackage): Promise<CreditPackage>;
    findById(id: string): Promise<CreditPackage | null>;
    findPackages(filters?: {
        isActive?: boolean;
    }, skip?: number, take?: number): Promise<{
        data: CreditPackage[];
        total: number;
    }>;
    update(entity: CreditPackage): Promise<CreditPackage>;
    findActivePackages(): Promise<CreditPackage[]>;
    delete(id: string): Promise<void>;
    private toDomain;
}
//# sourceMappingURL=CreditPackageRepository.d.ts.map