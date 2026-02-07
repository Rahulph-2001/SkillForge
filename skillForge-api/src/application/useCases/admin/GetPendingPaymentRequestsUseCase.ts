import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetPendingPaymentRequestsUseCase } from './interfaces/IGetPendingPaymentRequestsUseCase';
import { PendingPaymentRequestDTO } from '../../dto/admin/PendingPaymentRequestDTO';
import { ProjectPaymentRequestType } from '../../../domain/entities/ProjectPaymentRequest';

@injectable()
export class GetPendingPaymentRequestsUseCase implements IGetPendingPaymentRequestsUseCase {
    constructor(
        @inject(TYPES.IProjectPaymentRequestRepository) private readonly paymentRequestRepository: IProjectPaymentRequestRepository,
        @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
    ) { }

    async execute(): Promise<PendingPaymentRequestDTO[]> {
        const requests = await this.paymentRequestRepository.findPending();

        const dtos: PendingPaymentRequestDTO[] = [];

        for (const req of requests) {
            try {
                const project = await this.projectRepository.findById(req.projectId);
                const requester = await this.userRepository.findById(req.requestedBy);

                if (project && requester && !project.isSuspended) {
                    dtos.push({
                        id: req.id!,
                        projectId: req.projectId,
                        projectTitle: project.title,
                        type: req.type as 'RELEASE' | 'REFUND',
                        amount: req.amount,
                        requestedBy: {
                            id: requester.id,
                            name: requester.name,
                            email: requester.email.value
                        },
                        recipientId: req.recipientId,
                        status: 'PENDING',
                        createdAt: req.createdAt
                    });
                }
            } catch (error) {
                console.error(`Error fetching details for payment request ${req.id}:`, error);
            }
        }

        return dtos;
    }
}
