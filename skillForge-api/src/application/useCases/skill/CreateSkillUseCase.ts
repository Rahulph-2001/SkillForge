import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IS3Service } from '../../../domain/services/IS3Service';
import { Skill } from '../../../domain/entities/Skill';
import { CreateSkillDTO } from '../../dto/skill/CreateSkillDTO';
import { ICreateSkillUseCase } from './interfaces/ICreateSkillUseCase';
import { SkillResponseDTO } from '../../dto/skill/SkillResponseDTO';
import { ISkillMapper } from '../../mappers/interfaces/ISkillMapper';

@injectable()
export class CreateSkillUseCase implements ICreateSkillUseCase {
  constructor(
    @inject(TYPES.ISkillRepository) private skillRepository: ISkillRepository,
    @inject(TYPES.IS3Service) private s3Service: IS3Service,
    @inject(TYPES.ISkillMapper) private skillMapper: ISkillMapper
  ) {}

  async execute(
    userId: string, 
    data: CreateSkillDTO, 
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<SkillResponseDTO> {
    let imageUrl: string | null = null;

    if (imageFile) {
      // Create S3 key with skills/ prefix
      const key = `skills/${Date.now()}-${imageFile.originalname}`;
      imageUrl = await this.s3Service.uploadFile(
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
    return this.skillMapper.toResponseDTO(createdSkill);
  }
}