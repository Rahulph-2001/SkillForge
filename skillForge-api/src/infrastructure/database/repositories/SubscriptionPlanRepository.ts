import { injectable, inject } from 'inversify';
import { Database } from '../Database';
import { SubscriptionPlan } from '../../../domain/entities/SubscriptionPlan';
import {
  ISubscriptionPlanRepository,
  SubscriptionStats
} from '../../../domain/repositories/ISubscriptionPlanRepository';
import { NotFoundError } from '../../../domain/errors/AppError';
import { TYPES } from '../../di/types';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class PrismaSubscriptionPlanRepository extends BaseRepository<SubscriptionPlan> implements ISubscriptionPlanRepository {
  constructor(@inject(TYPES.Database) db: Database) {
    super(db, 'subscriptionPlanModel');
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    const plans = await this.prisma.subscriptionPlanModel.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
      include: {
        features: true
      }
    });

    return plans.map((plan) => this.toDomain(plan));
  }

 async findWithPagination(filters: {
  page: number;
  limit: number;
  isActive?: boolean;
}): Promise<{
  plans: SubscriptionPlan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  } else {
    where.isActive = true;
  }

  const total = await this.prisma.subscriptionPlanModel.count({ where });

  const plans = await this.prisma.subscriptionPlanModel.findMany({
    where,
    skip,
    take: limit,
    orderBy: { price: 'asc' },
    include: { features: true }
  });

  return {
    plans: plans.map((plan) => this.toDomain(plan)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const plan = await this.prisma.subscriptionPlanModel.findUnique({
      where: { id },
      include: {
        features: true
      }
    });

    if (!plan) {
      return null;
    }

    return this.toDomain(plan);
  }

  async findByName(name: string): Promise<SubscriptionPlan | null> {
    const plan = await this.prisma.subscriptionPlanModel.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (!plan) {
      return null;
    }

    return this.toDomain(plan);
  }

  async create(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    const planData = plan.toJSON();

    const createdPlan = await this.prisma.subscriptionPlanModel.create({
      data: {
        name: planData.name as string,
        price: planData.price as number,
        currency: (planData.currency as string) || 'INR',
        billingInterval: (planData.billingInterval as any) || 'MONTHLY',
        trialDays: (planData.trialDays as number) || 0,
        projectPosts: planData.projectPosts as number | null,
        createCommunity: planData.createCommunity as number | null,
        badge: planData.badge as any,
        color: planData.color as string,
        isPopular: (planData.isPopular as boolean) || false,
        displayOrder: (planData.displayOrder as number) || 0,
        isActive: planData.isActive as boolean,
        isPublic: planData.isPublic !== undefined ? (planData.isPublic as boolean) : true,
      },
      include: {
        features: true
      }
    });

    return this.toDomain(createdPlan);
  }

  async update(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    const planData = plan.toJSON();

    try {
      const updatedPlan = await this.prisma.subscriptionPlanModel.update({
        where: { id: plan.id },
        data: {
          name: planData.name as string,
          price: planData.price as number,
          currency: planData.currency as string | undefined,
          billingInterval: planData.billingInterval as any,
          trialDays: planData.trialDays as number | undefined,
          projectPosts: planData.projectPosts as number | null,
          createCommunity: planData.createCommunity as number | null,
          badge: planData.badge as any,
          color: planData.color as string,
          isPopular: planData.isPopular as boolean | undefined,
          displayOrder: planData.displayOrder as number | undefined,
          isActive: planData.isActive as boolean,
          isPublic: planData.isPublic as boolean | undefined,
          updatedAt: new Date(),
        },
        include: {
          features: true
        }
      });

      return this.toDomain(updatedPlan);
    } catch (error) {
      throw new NotFoundError('Subscription plan not found');
    }
  }

  async delete(id: string): Promise<void> {
    // Soft delete by setting isActive to false
    try {
      await this.prisma.subscriptionPlanModel.update({
        where: { id },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new NotFoundError('Subscription plan not found');
    }
  }

  async getStats(): Promise<SubscriptionStats> {
    const plans = await this.prisma.subscriptionPlanModel.findMany({
      where: { isActive: true },
    });

    const totalRevenue = plans.reduce((sum, plan) => sum + Number(plan.price), 0);
    const monthlyRecurring = totalRevenue;
    const activeSubscriptions = plans.length;
    const paidUsers = plans.filter((p) => Number(p.price) > 0).length;
    const freeUsers = plans.filter((p) => Number(p.price) === 0).length;

    return {
      totalRevenue,
      monthlyRecurring,
      activeSubscriptions,
      paidUsers,
      freeUsers,
    };
  }

  async nameExists(name: string, excludePlanId?: string): Promise<boolean> {
    const plan = await this.prisma.subscriptionPlanModel.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
        isActive: true,
        ...(excludePlanId && { id: { not: excludePlanId } }),
      },
    });

    return plan !== null;
  }

  private toDomain(prismaModel: any): SubscriptionPlan {
    return SubscriptionPlan.fromJSON({
      id: prismaModel.id,
      name: prismaModel.name,
      price: Number(prismaModel.price),
      projectPosts: prismaModel.projectPosts,
      createCommunity: prismaModel.createCommunity,
      features: prismaModel.features ? prismaModel.features.map((f: any) => ({
        id: f.id,
        name: f.name,
        description: f.description,
        featureType: f.featureType,
        limitValue: f.limitValue,
        isEnabled: f.isEnabled,
        displayOrder: f.displayOrder,
        isHighlighted: f.isHighlighted
      })) : [],
      badge: prismaModel.badge,
      color: prismaModel.color,
      isActive: prismaModel.isActive,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt,
      trialDays: prismaModel.trialDays || 0,
    });
  }
}