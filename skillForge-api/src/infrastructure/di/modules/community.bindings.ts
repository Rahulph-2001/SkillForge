import { Container } from 'inversify';
import { TYPES } from '../types';
import { CreateCommunityUseCase } from '../../../application/useCases/community/CreateCommunityUseCase';
import { ICreateCommunityUseCase } from '../../../application/useCases/community/interfaces/ICreateCommunityUseCase';
import { UpdateCommunityUseCase } from '../../../application/useCases/community/UpdateCommunityUseCase';
import { IUpdateCommunityUseCase } from '../../../application/useCases/community/interfaces/IUpdateCommunityUseCase';
import { GetCommunitiesUseCase } from '../../../application/useCases/community/GetCommunitiesUseCase';
import { IGetCommunitiesUseCase } from '../../../application/useCases/community/interfaces/IGetCommunitiesUseCase';
import { GetCommunityDetailsUseCase } from '../../../application/useCases/community/GetCommunityDetailsUseCase';
import { IGetCommunityDetailsUseCase } from '../../../application/useCases/community/interfaces/IGetCommunityDetailsUseCase';
import { JoinCommunityUseCase } from '../../../application/useCases/community/JoinCommunityUseCase';
import { IJoinCommunityUseCase } from '../../../application/useCases/community/interfaces/IJoinCommunityUseCase';
import { LeaveCommunityUseCase } from '../../../application/useCases/community/LeaveCommunityUseCase';
import { ILeaveCommunityUseCase } from '../../../application/useCases/community/interfaces/ILeaveCommunityUseCase';
import { SendMessageUseCase } from '../../../application/useCases/community/SendMessageUseCase';
import { ISendMessageUseCase } from '../../../application/useCases/community/interfaces/ISendMessageUseCase';
import { GetCommunityMessagesUseCase } from '../../../application/useCases/community/GetCommunityMessagesUseCase';
import { IGetCommunityMessagesUseCase } from '../../../application/useCases/community/interfaces/IGetCommunityMessagesUseCase';
import { PinMessageUseCase } from '../../../application/useCases/community/PinMessageUseCase';
import { IPinMessageUseCase } from '../../../application/useCases/community/interfaces/IPinMessageUseCase';
import { UnpinMessageUseCase } from '../../../application/useCases/community/UnpinMessageUseCase';
import { IUnpinMessageUseCase } from '../../../application/useCases/community/interfaces/IUnpinMessageUseCase';
import { DeleteMessageUseCase } from '../../../application/useCases/community/DeleteMessageUseCase';
import { IDeleteMessageUseCase } from '../../../application/useCases/community/interfaces/IDeleteMessageUseCase';
import { RemoveCommunityMemberUseCase } from '../../../application/useCases/community/RemoveCommunityMemberUseCase';
import { IRemoveCommunityMemberUseCase } from '../../../application/useCases/community/interfaces/IRemoveCommunityMemberUseCase';
import { AddReactionUseCase } from '../../../application/useCases/community/AddReactionUseCase';
import { IAddReactionUseCase } from '../../../application/useCases/community/interfaces/IAddReactionUseCase';
import { RemoveReactionUseCase } from '../../../application/useCases/community/RemoveReactionUseCase';
import { IRemoveReactionUseCase } from '../../../application/useCases/community/interfaces/IRemoveReactionUseCase';
import { GetCommunityMembersUseCase } from '../../../application/useCases/community/GetCommunityMembersUseCase';
import { IGetCommunityMembersUseCase } from '../../../application/useCases/community/interfaces/IGetCommunityMembersUseCase';
import { CheckCommunityMembershipExpiryUseCase } from '../../../application/useCases/community/CheckCommunityMembershipExpiryUseCase';
import { ICheckCommunityMembershipExpiryUseCase } from '../../../application/useCases/community/interfaces/ICheckCommunityMembershipExpiryUseCase';
import { CommunityController } from '../../../presentation/controllers/community/CommunityController';
import { CommunityRoutes } from '../../../presentation/routes/community/communityRoutes';
import { ProcessAutoRenewMembershipsUseCase } from '../../../application/useCases/community/ProcessAutoRenewMembershipsUseCase';
import { IProcessAutoRenewMembershipsUseCase } from '../../../application/useCases/community/interfaces/IProcessAutoRenewMembershipsUseCase';

/**
 * Binds all community-related use cases, controllers, and routes
 */
export const bindCommunityModule = (container: Container): void => {
  // Community Use Cases
  container.bind<ICreateCommunityUseCase>(TYPES.ICreateCommunityUseCase).to(CreateCommunityUseCase);
  container.bind<IUpdateCommunityUseCase>(TYPES.IUpdateCommunityUseCase).to(UpdateCommunityUseCase);
  container.bind<IGetCommunitiesUseCase>(TYPES.IGetCommunitiesUseCase).to(GetCommunitiesUseCase);
  container.bind<IGetCommunityDetailsUseCase>(TYPES.IGetCommunityDetailsUseCase).to(GetCommunityDetailsUseCase);
  container.bind<IJoinCommunityUseCase>(TYPES.IJoinCommunityUseCase).to(JoinCommunityUseCase);
  container.bind<ILeaveCommunityUseCase>(TYPES.ILeaveCommunityUseCase).to(LeaveCommunityUseCase);
  container.bind<IGetCommunityMembersUseCase>(TYPES.IGetCommunityMembersUseCase).to(GetCommunityMembersUseCase);
  container.bind<IRemoveCommunityMemberUseCase>(TYPES.IRemoveCommunityMemberUseCase).to(RemoveCommunityMemberUseCase);
  container.bind<ICheckCommunityMembershipExpiryUseCase>(TYPES.ICheckCommunityMembershipExpiryUseCase).to(CheckCommunityMembershipExpiryUseCase);
  
  // Message Use Cases
  container.bind<ISendMessageUseCase>(TYPES.ISendMessageUseCase).to(SendMessageUseCase);
  container.bind<IGetCommunityMessagesUseCase>(TYPES.IGetCommunityMessagesUseCase).to(GetCommunityMessagesUseCase);
  container.bind<IPinMessageUseCase>(TYPES.IPinMessageUseCase).to(PinMessageUseCase);
  container.bind<IUnpinMessageUseCase>(TYPES.IUnpinMessageUseCase).to(UnpinMessageUseCase);
  container.bind<IDeleteMessageUseCase>(TYPES.IDeleteMessageUseCase).to(DeleteMessageUseCase);
  container.bind<IAddReactionUseCase>(TYPES.IAddReactionUseCase).to(AddReactionUseCase);
  container.bind<IRemoveReactionUseCase>(TYPES.IRemoveReactionUseCase).to(RemoveReactionUseCase);
  container.bind<IProcessAutoRenewMembershipsUseCase>(TYPES.IProcessAutoRenewMembershipsUseCase).to(ProcessAutoRenewMembershipsUseCase);
  
  // Controllers & Routes
  container.bind<CommunityController>(TYPES.CommunityController).to(CommunityController);
  container.bind<CommunityRoutes>(TYPES.CommunityRoutes).to(CommunityRoutes);
};

