import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreateSkillUseCase } from '../../../application/useCases/skill/interfaces/ICreateSkillUseCase';
import { IListUserSkillsUseCase } from '../../../application/useCases/skill/interfaces/IListUserSkillsUseCase';
import { IUpdateSkillUseCase } from '../../../application/useCases/skill/UpdateSkillUseCase';
import { IToggleSkillBlockUseCase } from '../../../application/useCases/skill/ToggleSkillBlockUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { CreateSkillDTO } from '../../../application/dto/skill/CreateSkillDTO';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class SkillController {
  constructor(
    @inject(TYPES.CreateSkillUseCase) private readonly createSkillUseCase: ICreateSkillUseCase,
    @inject(TYPES.ListUserSkillsUseCase) private readonly listUserSkillsUseCase: IListUserSkillsUseCase,
    @inject(TYPES.UpdateSkillUseCase) private readonly updateSkillUseCase: IUpdateSkillUseCase,
    @inject(TYPES.ToggleSkillBlockUseCase) private readonly toggleSkillBlockUseCase: IToggleSkillBlockUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) { }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const file = req.file;
      const skillDTO: CreateSkillDTO = req.body;

      const skill = await this.createSkillUseCase.execute(
        userId,
        skillDTO,
        file ? {
          buffer: file.buffer,
          originalname: file.originalname,
          mimetype: file.mimetype
        } : undefined
      );

      const response = this.responseBuilder.success(
        skill,
        SUCCESS_MESSAGES.SKILL.CREATED,
        HttpStatusCode.CREATED
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  public listMySkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const skills = await this.listUserSkillsUseCase.execute(userId);

      const response = this.responseBuilder.success(
        skills,
        SUCCESS_MESSAGES.SKILL.FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;
      const updates = req.body;
      const file = req.file;

      console.log('🔍 [SkillController] Update request received:', {
        skillId: id,
        userId,
        hasFile: !!file
      });

      // Parse numeric fields from multipart/form-data (which come as strings)
      if (updates.durationHours) updates.durationHours = Number(updates.durationHours);
      if (updates.creditsPerHour) updates.creditsPerHour = Number(updates.creditsPerHour);

      // Parse tags if it comes as a JSON string
      if (updates.tags && typeof updates.tags === 'string') {
        try {
          updates.tags = JSON.parse(updates.tags);
        } catch (e) {
          console.error('❌ [SkillController] Failed to parse tags:', e);
        }
      }

      if (file) {
        // If file is present, we need to upload it.
        // Since UpdateSkillUseCase expects just DTO, we might need to handle upload here 
        // OR update UpdateSkillUseCase to handle file.
        // Looking at CreateSkillUseCase, it handles the file. 
        // However, UpdateSkillUseCase signature is (skillId, providerId, updates).
        // I will check if I can modify UpdateSkillUseCase or if I should upload here.
        // The cleanest way is to pass the file to UseCase like in Create.
        // But I'll stick to the plan: Modify Controller to upload (if I have S3Service) OR modify UseCase.
        // Looking at CreateSkillUseCase again (step 116), it injects S3Service.
        // UpdateSkillUseCase (step 92) does NOT inject S3Service.
        // So I should modify UpdateSkillUseCase to accept file just like CreateSkillUseCase.
      }

      // WAIT, I should modify UpdateSkillUseCase to consistency.
      // But let's check if I can just pass it.

      const skill = await this.updateSkillUseCase.execute(id, userId, updates, file ? {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype
      } : undefined);

      const response = this.responseBuilder.success(
        skill,
        SUCCESS_MESSAGES.SKILL.UPDATED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  public toggleBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      const skill = await this.toggleSkillBlockUseCase.execute(id, userId);

      const response = this.responseBuilder.success(
        skill,
        skill.isBlocked ? 'Skill blocked successfully' : 'Skill unblocked successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
}