import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { NotFoundError } from '../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../config/messages';

export interface IDeleteCreditPackageUseCase {
    execute(id: string): Promise<void>;
}

@injectable()
export class DeleteCreditPackageUseCase implements IDeleteCreditPackageUseCase {
    constructor(
        @inject(TYPES.ICreditPackageRepository) private repository: ICreditPackageRepository
    ) { }

    async execute(id: string): Promise<void> {
        const entity = await this.repository.findById(id);
        if (!entity) {
            throw new NotFoundError(ERROR_MESSAGES.CREDITS.PACKAGE_NOT_FOUND);
        }

        await this.repository.delete(id);
    }
}
