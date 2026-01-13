import { Skill } from '../../../../domain/entities/Skill';

export interface UpdateSkillDTO {
    description?: string;
    category?: string;
    level?: string;
    durationHours?: number;
    creditsPerHour?: number;
    tags?: string[];
    imageUrl?: string;
}

export interface IUpdateSkillUseCase {
    execute(
        skillId: string,
        providerId: string,
        updates: UpdateSkillDTO,
        imageFile?: { buffer: Buffer; originalname: string; mimetype: string }
    ): Promise<Skill>;
}

