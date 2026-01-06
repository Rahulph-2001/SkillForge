import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IGetSkillDetailsUseCase } from '../../../application/useCases/skill/interfaces/IGetSkillDetailsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class SkillDetailsController {
  constructor(
    @inject(TYPES.IGetSkillDetailsUseCase) private getSkillDetailsUseCase: IGetSkillDetailsUseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) {}

  public getDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { skillId } = req.params;

      const skillDetails = await this.getSkillDetailsUseCase.execute(skillId);

      const response = this.responseBuilder.success(
        skillDetails,
        'Skill details retrieved successfully',
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
}
