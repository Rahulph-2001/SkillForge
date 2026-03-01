import { type IUserRepository } from "../repositories/IUserRepository";
import { type ICommunityRepository } from "../repositories/ICommunityRepository";
import { type IUsageRecordRepository } from "../repositories/IUsageRecordRepository";

export interface TransactionRepositories {

    userRepository: IUserRepository;
    communityRepository: ICommunityRepository;
    usageRecordRepository: IUsageRecordRepository;
}

export interface ITransactionService {
    execute<T>(callback: (repositories: TransactionRepositories)=> Promise<T>): Promise<T>;
}