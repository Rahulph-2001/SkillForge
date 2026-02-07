import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { IProjectPaymentRequestRepository } from '../../../domain/repositories/IProjectPaymentRequestRepository';
import { IAdminGetProjectDetailsUseCase } from './interfaces/IAdminGetProjectDetailsUseCase';
import { AdminProjectDetailsDTO } from '../../dto/admin/AdminProjectDetailsDTO';
import { NotFoundError } from '../../../domain/errors/AppError';
import { PaymentStatus } from '../../../domain/enums/PaymentEnums';
import { ProjectStatus } from '../../../domain/entities/Project';
import { ProjectPaymentRequestStatus } from '../../../domain/entities/ProjectPaymentRequest';

@injectable()
export class AdminGetProjectDetailsUseCase implements IAdminGetProjectDetailsUseCase {
  constructor(
    @inject(TYPES.IProjectRepository) private readonly projectRepository: IProjectRepository,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IPaymentRepository) private readonly paymentRepository: IPaymentRepository,
    @inject(TYPES.IProjectPaymentRequestRepository) private readonly paymentRequestRepository: IProjectPaymentRequestRepository
  ) { }

  async execute(projectId: string): Promise<AdminProjectDetailsDTO> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const creator = await this.userRepository.findById(project.clientId);
    if (!creator) {
      throw new NotFoundError('Project creator not found');
    }

    let contributor = null;
    if (project.acceptedContributor) {
      contributor = {
        id: project.acceptedContributor.id,
        name: project.acceptedContributor.name,
        avatarUrl: project.acceptedContributor.avatarUrl || null,
      };
    }

    // Get escrow info from Payment and ProjectPaymentRequest
    let escrow = null;
    if (project.paymentId) {
      const payment = await this.paymentRepository.findById(project.paymentId);
      if (payment && payment.status === PaymentStatus.SUCCEEDED) {
        // Determine escrow status based on project status and payment request
        let escrowStatus = 'HELD';
        let releaseTo = 'Pending';

        if (project.status === ProjectStatus.COMPLETED) {
          escrowStatus = 'RELEASED';
          releaseTo = 'Contributor';
        } else if (project.status === ProjectStatus.CANCELLED) {
          escrowStatus = 'REFUNDED';
          releaseTo = 'Creator';
        } else {
          // Check if there's a processed payment request
          const paymentRequests = await this.paymentRequestRepository.findByProjectId(projectId);
          const processedRequest = paymentRequests.find(r => r.status === ProjectPaymentRequestStatus.APPROVED);

          if (processedRequest) {
            if (processedRequest.isReleaseRequest()) {
              escrowStatus = 'RELEASED';
              releaseTo = 'Contributor';
            } else if (processedRequest.isRefundRequest()) {
              escrowStatus = 'REFUNDED';
              releaseTo = 'Creator';
            }
          }
        }

        escrow = {
          amountHeld: payment.amount,
          status: escrowStatus,
          releaseTo,
        };
      }
    }

    return {
      id: project.id!,
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags,
      budget: project.budget,
      duration: project.duration,
      deadline: project.deadline ?? null,
      status: project.status,
      applicationsCount: project.applicationsCount,
      isSuspended: project.isSuspended,
      suspendedAt: project.suspendedAt ?? null,
      suspendReason: project.suspendReason ?? null,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      creator: {
        id: creator.id,
        name: creator.name,
        email: creator.email.value,
        avatarUrl: creator.avatarUrl || null,
        rating: creator.rating || 0,
      },
      contributor,
      escrow,
    };
  }
}