import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetAllSkillsUseCase } from './interfaces/IGetAllSkillsUseCase';

export interface SkillDTO {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  title: string;
  description: string;
  category: string;
  level: string;
  durationHours: number;
  creditsPerHour: number;
  tags: string[];
  imageUrl: string | null;
  templateId: string | null;
  status: string;
  verificationStatus: string | null;
  mcqScore: number | null;
  mcqTotalQuestions: number | null;
  mcqPassingScore: number | null;
  verifiedAt: Date | null;
  rejectionReason: string | null;
  isBlocked: boolean;
  blockedReason: string | null;
  blockedAt: Date | null;
  totalSessions: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

@injectable()
export class GetAllSkillsUseCase implements IGetAllSkillsUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(): Promise<SkillDTO[]> {
    // Get all non-deleted skills that haven't failed verification
    const skills = await this.skillRepository.findAll();
    const filteredSkills = skills.filter(
      skill => !skill.isDeleted && skill.verificationStatus !== 'failed'
    );

    // Get unique provider IDs
    const providerIds = [...new Set(filteredSkills.map(s => s.providerId))];
    const providers = await this.userRepository.findByIds(providerIds);
    const providersMap = new Map(providers.map(p => [p.id, p]));

    // Map to DTOs
    return filteredSkills
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(skill => {
        const provider = providersMap.get(skill.providerId);
        return {
          id: skill.id,
          providerId: skill.providerId,
          providerName: provider?.name || 'Unknown',
          providerEmail: provider?.email.value || 'unknown@example.com',
          title: skill.title,
          description: skill.description,
          category: skill.category,
          level: skill.level,
          durationHours: skill.durationHours,
          creditsPerHour: Number(skill.creditsPerHour),
          tags: skill.tags,
          imageUrl: skill.imageUrl,
          templateId: skill.templateId,
          status: skill.status,
          verificationStatus: skill.verificationStatus,
          mcqScore: skill.mcqScore,
          mcqTotalQuestions: skill.mcqTotalQuestions,
          mcqPassingScore: skill.mcqPassingScore,
          verifiedAt: skill.verifiedAt,
          rejectionReason: skill.blockedReason,
          isBlocked: skill.isBlocked,
          blockedReason: skill.blockedReason,
          blockedAt: skill.blockedAt,
          totalSessions: skill.totalSessions,
          rating: skill.rating || 0,
          createdAt: skill.createdAt,
          updatedAt: skill.updatedAt,
        };
      });
  }
}
