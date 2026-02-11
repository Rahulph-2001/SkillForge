import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreditPackageRepository } from '../../../domain/repositories/ICreditPackageRepository';
import { IGetUserCreditPackagesUseCase } from './interfaaces/IGetUserCreditPackagesUseCase';
import { GetUserCreditPackagesResponseDTO, UserCreditPackageDTO } from '../../dto/credit/GetUserCreditPackagesDTO';

@injectable()
export class GetUserCreditPackagesUseCase implements IGetUserCreditPackagesUseCase {
    constructor(
        @inject(TYPES.ICreditPackageRepository) private readonly creditPackageRepository: ICreditPackageRepository
    ) { }

    async execute(): Promise<GetUserCreditPackagesResponseDTO> {
        const packages = await this.creditPackageRepository.findActivePackages();

        const packageDTOs: UserCreditPackageDTO[] = packages.map(pkg => {
            const discountMultiplier = (100 - pkg.discount) / 100;
            const finalPrice = pkg.price * discountMultiplier;
            const savingsAmount = pkg.price - finalPrice;

            return {
                id: pkg.id,
                credits: pkg.credits,
                price: pkg.price,
                isPopular: pkg.isPopular,
                discount: pkg.discount,
                finalPrice,
                savingsAmount,
            };
        });

        return { packages: packageDTOs };
    }
}
