import { IUserRepository } from "../repositories/IUserRepository";
import { ICommunityRepository } from "../repositories/ICommunityRepository";
import { IUsageRecordRepository } from "../repositories/IUsageRecordRepository";

export interface TransactionRepositories {

    userRepository: IUserRepository;
    communityRepository: ICommunityRepository;
    usageRecordRepository: IUsageRecordRepository;
}

export interface ITransactionService {
    execute<T>(callback: (repositories: TransactionRepositories)=> Promise<T>): Promise<T>;
}