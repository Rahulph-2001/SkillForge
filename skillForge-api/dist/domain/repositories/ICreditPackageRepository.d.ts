import { CreditPackage } from '../entities/CreditPackage';
export interface ICreditPackageRepository {
    create(entity: CreditPackage): Promise<CreditPackage>;
    findById(id: string): Promise<CreditPackage | null>;
    findPackages(filters?: {
        isActive?: boolean;
    }, skip?: number, take?: number): Promise<{
        data: CreditPackage[];
        total: number;
    }>;
    update(entity: CreditPackage): Promise<CreditPackage>;
    delete(id: string): Promise<void>;
    findActivePackages(): Promise<CreditPackage[]>;
}
//# sourceMappingURL=ICreditPackageRepository.d.ts.map