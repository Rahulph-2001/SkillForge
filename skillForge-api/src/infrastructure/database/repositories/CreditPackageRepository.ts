/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { CreditPackage } from '../../../domain/entities/CreditPackage';

@injectable()
export class CreditPackageRepository extends BaseRepository<CreditPackage> implements ICreditPackageRepository {
    constructor(@inject(TYPES.Database) db: Database) {
        super(db, 'creditPackage');
    }

    public async create(entity: CreditPackage): Promise<CreditPackage> {

        const data = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.prisma as any).creditPackage.create({
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
        const data = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.prisma as any).creditPackage.findUnique({
            where: { id, isDeleted: false },
        });
        return data ? this.toDomain(data) : null;
    }

    async findPackages(filters?: { isActive?: boolean }, skip?: number, take?: number): Promise<{ data: CreditPackage[], total: number }> {
        const where: Record<string, unknown> = { isDeleted: false };
        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        const [data, total] = await Promise.all([
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.prisma as any).creditPackage.findMany({
                where,
                orderBy: { price: 'asc' },
                skip,
                take,
            }),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.prisma as any).creditPackage.count({ where })
        ]);

        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: data.map((item: any) => this.toDomain(item)),
            total
        };
    }

    async update(entity: CreditPackage): Promise<CreditPackage> {
        const data = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.prisma as any).creditPackage.update({
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
        await // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.prisma as any).creditPackage.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    private toDomain(data: Record<string, unknown>): CreditPackage {
        return new CreditPackage({
            id: data.id as string | undefined,
            credits: data.credits as number,
            price: Number(data.price),
            isPopular: data.isPopular as boolean | undefined,
            isActive: data.isActive as boolean | undefined,
            discount: data.discount as number | undefined,
            createdAt: data.createdAt as Date | undefined,
            updatedAt: data.updatedAt as Date | undefined,
            isDeleted: data.isDeleted as boolean | undefined,
        });
    }
}