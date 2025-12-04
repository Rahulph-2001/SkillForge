import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreateSkillUseCase } from '../../../application/useCases/skill/interfaces/ICreateSkillUseCase';
import { IListUserSkillsUseCase } from '../../../application/useCases/skill/interfaces/IListUserSkillsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { CreateSkillDTO } from '../../../application/dto/skill/CreateSkillDTO';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class SkillController {
  constructor(
    @inject(TYPES.CreateSkillUseCase) private readonly createSkillUseCase: ICreateSkillUseCase,
    @inject(TYPES.ListUserSkillsUseCase) private readonly listUserSkillsUseCase: IListUserSkillsUseCase,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) {}

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
}