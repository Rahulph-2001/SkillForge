import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
export interface IDeleteCreditPackageUseCase {
    execute(id: string): Promise<void>;
}
export declare class DeleteCreditPackageUseCase implements IDeleteCreditPackageUseCase {
    private repository;
    constructor(repository: ICreditPackageRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=DeleteCreditPackageUseCase.d.ts.map