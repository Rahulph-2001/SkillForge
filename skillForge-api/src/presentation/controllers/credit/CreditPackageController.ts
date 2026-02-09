import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { ICreateCreditPackageUseCase } from '../../../application/useCases/credit/CreateCreditPackageUseCase';
import { IGetCreditPackagesUseCase } from '../../../application/useCases/credit/GetCreditPackagesUseCase';
import { IUpdateCreditPackageUseCase } from '../../../application/useCases/credit/interfaaces/IUpdateCreditPackageUseCase';
import { IDeleteCreditPackageUseCase } from '../../../application/useCases/credit/DeleteCreditPackageUseCase';

@injectable()
export class CreditPackageController {
    constructor(
        @inject(TYPES.ICreateCreditPackageUseCase) private readonly createUseCase: ICreateCreditPackageUseCase,
        @inject(TYPES.IGetCreditPackagesUseCase) private readonly getUseCase: IGetCreditPackagesUseCase,
        @inject(TYPES.IUpdateCreditPackageUseCase) private readonly updateUseCase: IUpdateCreditPackageUseCase,
        @inject(TYPES.IDeleteCreditPackageUseCase) private readonly deleteUseCase: IDeleteCreditPackageUseCase,
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
    ) { }

    public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.createUseCase.execute(req.body);
            const response = this.responseBuilder.success(
                result,
                SUCCESS_MESSAGES.CREDITS.PACKAGE_CREATED,
                HttpStatusCode.CREATED
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };

    public list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const filters = {
                isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined
            };

            const result = await this.getUseCase.execute(page, limit, filters);
            const response = this.responseBuilder.success(
                result,
                SUCCESS_MESSAGES.CREDITS.PACKAGES_FETCHED,
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.updateUseCase.execute(id, req.body);
            const response = this.responseBuilder.success(
                result,
                SUCCESS_MESSAGES.CREDITS.PACKAGE_UPDATED,
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            await this.deleteUseCase.execute(id);
            const response = this.responseBuilder.success(
                null,
                SUCCESS_MESSAGES.CREDITS.PACKAGE_DELETED,
                HttpStatusCode.OK
            );
            res.status(response.statusCode).json(response.body);
        } catch (error) {
            next(error);
        }
    };
}