import { PrismaClient, Prisma } from '@prisma/client';

export interface CreateBookingDTO {
  learnerId: string;
  skillId: string;
  providerId: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export class CreateBookingUseCase {
  constructor(private prisma: PrismaClient) {}

  async execute(dto: CreateBookingDTO) {
    console.log('🟡 [CreateBookingUseCase] Executing with data:', JSON.stringify(dto, null, 2));

    // Validate skill exists and is approved
    const skill = await this.prisma.skill.findUnique({
      where: { id: dto.skillId },
      include: { provider: true },
    });

    if (!skill) {
      console.error('❌ [CreateBookingUseCase] Skill not found:', dto.skillId);
      throw new Error('Skill not found');
    }

    console.log('🟡 [CreateBookingUseCase] Skill found:', { 
      id: skill.id, 
      status: skill.status, 
      isBlocked: skill.isBlocked,
      providerId: skill.providerId 
    });

    if (skill.status !== 'approved') {
      console.error('❌ [CreateBookingUseCase] Skill not approved. Status:', skill.status);
      throw new Error('This skill is not available for booking');
    }

    if (skill.isBlocked) {
      console.error('❌ [CreateBookingUseCase] Skill is blocked');
      throw new Error('This skill is currently blocked');
    }

    // Validate provider exists and matches
    if (skill.providerId !== dto.providerId) {
      console.error('❌ [CreateBookingUseCase] Provider mismatch. Expected:', skill.providerId, 'Got:', dto.providerId);
      throw new Error('Invalid provider for this skill');
    }

    // Validate learner is not the provider
    if (dto.learnerId === dto.providerId) {
      console.error('❌ [CreateBookingUseCase] Learner is provider');
      throw new Error('You cannot book your own skill');
    }

    // Calculate session cost
    const sessionCost = skill.creditsPerHour * skill.durationHours;

    // Validate learner has sufficient credits
    const learner = await this.prisma.user.findUnique({
      where: { id: dto.learnerId },
    });

    if (!learner) {
      console.error('❌ [CreateBookingUseCase] Learner not found:', dto.learnerId);
      throw new Error('Learner not found');
    }

    console.log('🟡 [CreateBookingUseCase] Learner found. Credits:', learner.credits, 'Cost:', sessionCost);

    if (learner.credits < sessionCost) {
      console.error('❌ [CreateBookingUseCase] Insufficient credits');
      throw new Error('Insufficient credits to book this session');
    }

    // Validate date is in the future
    const preferredDateTime = new Date(`${dto.preferredDate}T${dto.preferredTime}`);
    if (preferredDateTime <= new Date()) {
      console.error('❌ [CreateBookingUseCase] Date not in future:', preferredDateTime);
      throw new Error('Preferred date and time must be in the future');
    }

    console.log('🟡 [CreateBookingUseCase] Creating booking in database...');

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        learnerId: dto.learnerId,
        skillId: dto.skillId,
        providerId: dto.providerId,
        preferredDate: new Date(dto.preferredDate),
        preferredTime: dto.preferredTime,
        message: dto.message || null,
        status: 'pending',
        sessionCost,
        isDeleted: false, // Explicitly set isDeleted to false
        notes: null,
        rescheduleInfo: Prisma.JsonNull,
      },
      include: {
        skill: {
          select: {
            title: true,
            category: true,
          },
        },
        provider: {
          select: {
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        learner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log('✅ [CreateBookingUseCase] Booking created successfully:', booking.id);
    return booking;
  }
}
