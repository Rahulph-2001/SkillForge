import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { Feature } from '../../../domain/entities/Feature';
import { FeatureType } from '../../../domain/enums/SubscriptionEnums';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class PrismaFeatureRepository extends BaseRepository<Feature> implements IFeatureRepository {
    constructor(@inject(TYPES.Database) db: Database) {
        super(db, 'feature');
    }

    async create(feature: Feature): Promise<Feature> {
        const data = await this.prisma.feature.create({
            data: {
                planId: feature.planId,
                name: feature.name,
                description: feature.description,
                featureType: feature.featureType as any,
                limitValue: feature.limitValue,
                isEnabled: feature.isEnabled,
                displayOrder: feature.displayOrder,
                isHighlighted: feature.isHighlighted,
            },
        });

        return Feature.fromJSON(data);
    }

    async findById(id: string): Promise<Feature | null> {
        const data = await this.prisma.feature.findUnique({
            where: { id },
        });

        return data ? Feature.fromJSON(data) : null;
    }

    async findByPlanId(planId: string): Promise<Feature[]> {
        const data = await this.prisma.feature.findMany({
            where: { planId },
            orderBy: { displayOrder: 'asc' },
        });

        return data.map((item) => Feature.fromJSON(item));
    }

    async update(feature: Feature): Promise<Feature> {
        const data = await this.prisma.feature.update({
            where: { id: feature.id },
            data: {
                name: feature.name,
                description: feature.description,
                limitValue: feature.limitValue,
                isEnabled: feature.isEnabled,
                displayOrder: feature.displayOrder,
                isHighlighted: feature.isHighlighted,
                updatedAt: feature.updatedAt,
            },
        });

        return Feature.fromJSON(data);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.feature.delete({
            where: { id },
        });
    }

    async reorderFeatures(planId: string, featureIds: string[]): Promise<void> {
        // Update display order for each feature
        const updates = featureIds.map((featureId, index) =>
            this.prisma.feature.update({
                where: { id: featureId, planId },
                data: { displayOrder: index },
            })
        );

        await (this.prisma as PrismaClient).$transaction(updates);
    }

    async findHighlightedByPlanId(planId: string): Promise<Feature[]> {
        const data = await this.prisma.feature.findMany({
            where: {
                planId,
                isHighlighted: true,
            },
            orderBy: { displayOrder: 'asc' },
        });

        return data.map((item) => Feature.fromJSON(item));
    }

    async findLibraryFeatures(filters: { search?: string; isEnabled?: boolean; }, pagination: { skip: number; take: number; }): Promise<{ features: Feature[]; total: number; }> {
        const where: any ={
            planId: null
        };

        if(filters.search){
            where.OR = [
                {name: { contains: filters.search, mode: 'insesitive'}},
                {description: {contains: filters.search, mode: 'insensitive'}}
            ]
        }

        if(typeof filters.isEnabled === 'boolean'){
            where.isEnabled = filters.isEnabled;
        }

        const [feature, total] = await Promise.all(
            [
                this.prisma.feature.findMany({
                    where,
                    skip: pagination.skip,
                    take: pagination.take,
                    orderBy: {displayOrder: 'asc'}
                }),
                this.prisma.feature.count({where})
            ]
        );

        return {
            features: feature.map((item)=> Feature.fromJSON(item)),
            total
        }
    }
}