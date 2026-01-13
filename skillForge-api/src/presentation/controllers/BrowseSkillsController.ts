import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/di/types';
import { IBrowseSkillsUseCase } from '../../application/useCases/skill/interfaces/IBrowseSkillsUseCase';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { BrowseSkillsRequestDTO } from '../../application/dto/skill/BrowseSkillsRequestDTO';

@injectable()
export class BrowseSkillsController {
  constructor(
    @inject(TYPES.IBrowseSkillsUseCase) private browseSkillsUseCase: IBrowseSkillsUseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) { }

  public browse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract userId from optional auth middleware
      const userId = req.user?.userId;

      const {
        search,
        category,
        level,
        minCredits,
        maxCredits,
        page,
        limit,
        sortBy,
        sortOrder
      } = req.query;

      const filters: BrowseSkillsRequestDTO = {
        search: search as string | undefined,
        category: category as string | undefined,
        level: level as any,
        minCredits: minCredits ? Number(minCredits) : undefined,
        maxCredits: maxCredits ? Number(maxCredits) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
        excludeProviderId: userId, // Exclude current user's skills if authenticated
      };

      const result = await this.browseSkillsUseCase.execute(filters);

      const response = this.responseBuilder.success(result, 'Skills retrieved successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
}
