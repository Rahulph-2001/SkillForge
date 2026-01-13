import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { ICommunityMapper } from '../../mappers/interfaces/ICommunityMapper';
import { CreateCommunityDTO } from '../../dto/community/CreateCommunityDTO';
import { CommunityResponseDTO } from '../../dto/community/CommunityResponseDTO';
import { ICreateCommunityUseCase } from './interfaces/ICreateCommunityUseCase';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { ITransactionService } from '../../../domain/services/ITransactionService';
export declare class CreateCommunityUseCase implements ICreateCommunityUseCase {
    private readonly communityRepository;
    private readonly storageService;
    private readonly communityMapper;
    private readonly subscriptionRepository;
    private readonly planRepository;
    private readonly featureRepository;
    private readonly usageRecordRepository;
    private readonly transactionService;
    constructor(communityRepository: ICommunityRepository, storageService: IStorageService, communityMapper: ICommunityMapper, subscriptionRepository: IUserSubscriptionRepository, planRepository: ISubscriptionPlanRepository, featureRepository: IFeatureRepository, usageRecordRepository: IUsageRecordRepository, transactionService: ITransactionService);
    execute(userId: string, dto: CreateCommunityDTO, imageFile?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<CommunityResponseDTO>;
}
//# sourceMappingURL=CreateCommunityUseCase.d.ts.map