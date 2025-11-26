import { injectable, inject } from 'inversify';
import { Database } from '../Database';
import { SubscriptionPlan } from '../../../domain/entities/SubscriptionPlan';
import { 
  ISubscriptionPlanRepository, 
  SubscriptionStats 
} from '../../../domain/repositories/ISubscriptionPlanRepository';
import { NotFoundError } from '../../../domain/errors/AppError';
import { TYPES } from '../../di/types';


@injectable()
export class PrismaSubscriptionPlanRepository implements ISubscriptionPlanRepository {
  private readonly prisma;

  constructor(@inject(TYPES.Database) db: Database) {
    this.prisma = db.getClient();
  }
  
  async findAll(): Promise<SubscriptionPlan[]> {
    const plans = await this.prisma.subscriptionPlanModel.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });

    return plans.map((plan) => this.toDomain(plan));
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const plan = await this.prisma.subscriptionPlanModel.findUnique({
      where: { id },
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
        projectPosts: planData.projectPosts as number | null,
        communityPosts: planData.communityPosts as number | null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        badge: planData.badge as any, // PlanBadge enum from Prisma
        color: planData.color as string,
        isActive: planData.isActive as boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        features: planData.features as any, // JsonValue from Prisma
      },
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
          projectPosts: planData.projectPosts as number | null,
          communityPosts: planData.communityPosts as number | null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          badge: planData.badge as any, // PlanBadge enum from Prisma
          color: planData.color as string,
          isActive: planData.isActive as boolean,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          features: planData.features as any, // JsonValue from Prisma
          updatedAt: new Date(),
        },
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
    // Get all active plans
    const plans = await this.prisma.subscriptionPlanModel.findMany({
      where: { isActive: true },
    });

    // For now, return mock statistics
    // In a real app, you would query actual user subscriptions
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

  /**
   * Convert Prisma model to Domain entity
   */
  private toDomain(prismaModel: {
    id: string;
    name: string;
    price: unknown; // Prisma Decimal type
    projectPosts: number | null;
    communityPosts: number | null;
    features: unknown; // Prisma JsonValue
    badge: unknown; // Prisma PlanBadge enum
    color: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): SubscriptionPlan {
    return SubscriptionPlan.fromJSON({
      id: prismaModel.id,
      name: prismaModel.name,
      price: Number(prismaModel.price),
      projectPosts: prismaModel.projectPosts,
      communityPosts: prismaModel.communityPosts,
      features: prismaModel.features,
      badge: prismaModel.badge,
      color: prismaModel.color,
      isActive: prismaModel.isActive,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt,
    });
  }
}
