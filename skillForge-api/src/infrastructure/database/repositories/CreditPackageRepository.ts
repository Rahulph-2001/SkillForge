import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { CreditPackage } from '../../../domain/entities/CreditPackage';

@injectable()
export class CreditPackageRepository extends BaseRepository<CreditPackage> implements ICreditPackageRepository {
    constructor(@inject(TYPES.Database) db: Database) {
        super(db, 'creditPackage' as any);
    }

    public async create(entity: CreditPackage): Promise<CreditPackage> {

        const data = await (this.prisma as any).creditPackage.create({
            data: {
                credits: entity.credits,
                price: entity.price,
                isPopular: entity.isPopular,
                isActive: entity.isActive,
                discount: entity.discount,
                isDeleted: entity.isDeleted,
            },
        });
        return this.toDomain(data);
    }

    async findById(id: string): Promise<CreditPackage | null> {
        const data = await (this.prisma as any).creditPackage.findUnique({
            where: { id, isDeleted: false },
        });
        return data ? this.toDomain(data) : null;
    }

    async findPackages(filters?: { isActive?: boolean }, skip?: number, take?: number): Promise<{ data: CreditPackage[], total: number }> {
        const where: any = { isDeleted: false };
        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        const [data, total] = await Promise.all([
            (this.prisma as any).creditPackage.findMany({
                where,
                orderBy: { price: 'asc' },
                skip,
                take,
            }),
            (this.prisma as any).creditPackage.count({ where })
        ]);

        return {
            data: data.map((item: any) => this.toDomain(item)),
            total
        };
    }

    async update(entity: CreditPackage): Promise<CreditPackage> {
        const data = await (this.prisma as any).creditPackage.update({
            where: { id: entity.id },
            data: {
                credits: entity.credits,
                price: entity.price,
                isPopular: entity.isPopular,
                isActive: entity.isActive,
                discount: entity.discount,
                isDeleted: entity.isDeleted,
            },
        });
        return this.toDomain(data);
    }

async findActivePackages(): Promise<CreditPackage[]> {
  const packages = await this.prisma.creditPackage.findMany({
    where: {
      isActive: true,
      isDeleted: false,
    },
    orderBy: [
      { isPopular: 'desc' },
      { credits: 'asc' },
    ],
  });
  
  return packages.map(pkg => new CreditPackage({
    id: pkg.id,
    credits: pkg.credits,
    price: Number(pkg.price),
    isPopular: pkg.isPopular,
    isActive: pkg.isActive,
    discount: pkg.discount,
    createdAt: pkg.createdAt,
    updatedAt: pkg.updatedAt,
    isDeleted: pkg.isDeleted,
  }));
}
    async delete(id: string): Promise<void> {
        await (this.prisma as any).creditPackage.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    private toDomain(data: any): CreditPackage {
        return new CreditPackage({
            id: data.id,
            credits: data.credits,
            price: Number(data.price),
            isPopular: data.isPopular,
            isActive: data.isActive,
            discount: data.discount,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            isDeleted: data.isDeleted,
        });
    }
}