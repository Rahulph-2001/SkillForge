import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { Skill } from '../../../domain/entities/Skill';
import { CreateSkillDTO } from '../../dto/skill/CreateSkillDTO';
import { ICreateSkillUseCase } from './interfaces/ICreateSkillUseCase';
import { SkillResponseDTO } from '../../dto/skill/SkillResponseDTO';
import { ISkillMapper } from '../../mappers/interfaces/ISkillMapper';
import { IAdminNotificationService } from '../../../domain/services/IAdminNotificationService';
import { NotificationType } from '../../../domain/entities/Notification';

@injectable()
export class CreateSkillUseCase implements ICreateSkillUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
    @inject(TYPES.IStorageService) private storageService: IStorageService,
    @inject(TYPES.ISkillMapper) private skillMapper: ISkillMapper,
    @inject(TYPES.IAdminNotificationService) private adminNotificationService: IAdminNotificationService
  ) { }

  async execute(
    userId: string,
    data: CreateSkillDTO,
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<SkillResponseDTO> {
    let imageUrl: string | null = null;

    if (imageFile) {
      // Create S3 key with skills/ prefix
      const key = `skills/${Date.now()}-${imageFile.originalname}`;
      imageUrl = await this.storageService.uploadFile(
        imageFile.buffer,
        key,
        imageFile.mimetype
      );
    }

    const skill = new Skill({
      providerId: userId,
      title: data.title,
      description: data.description,
      category: data.category,
      level: data.level,
      durationHours: Number(data.durationHours),
      creditsPerHour: Number(data.creditsHour),
      // Handle potential stringified array from FormData
      tags: typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags,
      imageUrl: imageUrl,
      templateId: data.templateId || null
    });

    const createdSkill = await this.skillRepository.create(skill);

    // Notify admins about new skill
    await this.adminNotificationService.notifyAllAdmins({
      type: NotificationType.NEW_SKILL_PENDING,
      title: 'New Skill Submitted',
      message: `A new skill "${createdSkill.title}" has been submitted for approval.`,
      data: { skillId: createdSkill.id, providerId: createdSkill.providerId }
    });

    return this.skillMapper.toResponseDTO(createdSkill);
  }
}