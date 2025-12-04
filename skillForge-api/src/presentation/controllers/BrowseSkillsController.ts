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
    @inject(TYPES.BrowseSkillsUseCase) private browseSkillsUseCase: IBrowseSkillsUseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) {}

  public browse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        search,
        category,
        level,
        minPrice,
        maxPrice,
        page,
        limit,
        excludeProviderId
      } = req.query;

      const filters: BrowseSkillsRequestDTO = {
        search: search as string | undefined,
        category: category as string | undefined,
        level: level as string | undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12,
        excludeProviderId: excludeProviderId as string | undefined,
      };

      const result = await this.browseSkillsUseCase.execute(filters);

      const response = this.responseBuilder.success(result, 'Skills retrieved successfully', HttpStatusCode.OK);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
}
