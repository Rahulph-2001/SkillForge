import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { GetSkillDetailsUseCase } from '../../../application/useCases/skill/GetSkillDetailsUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';

@injectable()
export class SkillDetailsController {
  constructor(
    @inject(TYPES.GetSkillDetailsUseCase) private getSkillDetailsUseCase: GetSkillDetailsUseCase,
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
