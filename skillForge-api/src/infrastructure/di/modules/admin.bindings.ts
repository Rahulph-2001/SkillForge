import { Container } from 'inversify';
import { TYPES } from '../types';
import { ListUsersUseCase } from '../../../application/useCases/admin/ListUsersUseCase';
import { IListUsersUseCase } from '../../../application/useCases/admin/interfaces/IListUsersUseCase';
import { SuspendUserUseCase } from '../../../application/useCases/admin/SuspendUserUseCase';
import { ISuspendUserUseCase } from '../../../application/useCases/admin/interfaces/ISuspendUserUseCase';
import { UnsuspendUserUseCase } from '../../../application/useCases/admin/UnsuspendUserUseCase';
import { IUnsuspendUserUseCase } from '../../../application/useCases/admin/interfaces/IUnsuspendUserUseCase';
import { ListCommunitiesUseCase } from '../../../application/useCases/admin/ListCommunitiesUseCase';
import { IListCommunitiesUseCase } from '../../../application/useCases/admin/interfaces/IListCommunitiesUseCase';
import { UpdateCommunityByAdminUseCase } from '../../../application/useCases/admin/UpdateCommunityByAdminUseCase';
import { IUpdateCommunityByAdminUseCase } from '../../../application/useCases/admin/interfaces/IUpdateCommunityByAdminUseCase';
import { BlockCommunityUseCase } from '../../../application/useCases/admin/BlockCommunityUseCase';
import { IBlockCommunityUseCase } from '../../../application/useCases/admin/interfaces/IBlockCommunityUseCase';
import { UnblockCommunityUseCase } from '../../../application/useCases/admin/UnblockCommunityUseCase';
import { IUnblockCommunityUseCase } from '../../../application/useCases/admin/interfaces/IUnblockCommunityUseCase';
import { ListPendingSkillsUseCase } from '../../../application/useCases/admin/ListPendingSkillsUseCase';
import { IListPendingSkillsUseCase } from '../../../application/useCases/admin/interfaces/IListPendingSkillsUseCase';
import { ApproveSkillUseCase } from '../../../application/useCases/admin/ApproveSkillUseCase';
import { IApproveSkillUseCase } from '../../../application/useCases/admin/interfaces/IApproveSkillUseCase';
import { RejectSkillUseCase } from '../../../application/useCases/admin/RejectSkillUseCase';
import { IRejectSkillUseCase } from '../../../application/useCases/admin/interfaces/IRejectSkillUseCase';
import { GetAllSkillsUseCase } from '../../../application/useCases/admin/GetAllSkillsUseCase';
import { IGetAllSkillsUseCase } from '../../../application/useCases/admin/interfaces/IGetAllSkillsUseCase';
import { BlockSkillUseCase } from '../../../application/useCases/admin/BlockSkillUseCase';
import { IBlockSkillUseCase } from '../../../application/useCases/admin/interfaces/IBlockSkillUseCase';
import { UnblockSkillUseCase } from '../../../application/useCases/admin/UnblockSkillUseCase';
import { IUnblockSkillUseCase } from '../../../application/useCases/admin/interfaces/IUnblockSkillUseCase';
import { GetAdminWalletStatsUseCase } from '../../../application/useCases/admin/GetAdminWalletStatsUseCase';
import { IGetAdminWalletStatsUseCase } from '../../../application/useCases/admin/interfaces/IGetAdminWalletStatsUseCase';
import { GetWalletTransactionsUseCase } from '../../../application/useCases/admin/GetWalletTransactionsUseCase';
import { IGetWalletTransactionsUseCase } from '../../../application/useCases/admin/interfaces/IGetWalletTransactionsUseCase';
import { CreditAdminWalletUseCase } from '../../../application/useCases/admin/CreditAdminWalletUseCase';
import { ICreditAdminWalletUseCase } from '../../../application/useCases/admin/interfaces/ICreditAdminWalletUseCase';
import { AdminListProjectsUseCase } from '../../../application/useCases/admin/AdminListProjectsUseCase';
import { IAdminListProjectsUseCase } from '../../../application/useCases/admin/interfaces/IAdminListProjectsUseCase';
import { AdminGetProjectStatsUseCase } from '../../../application/useCases/admin/AdminGetProjectStatsUseCase';
import { IAdminGetProjectStatsUseCase } from '../../../application/useCases/admin/interfaces/IAdminGetProjectStatsUseCase';
import { AdminController } from '../../../presentation/controllers/admin/AdminController';
import { AdminSkillController } from '../../../presentation/controllers/admin/AdminSkillController';
import { AdminWalletController } from '../../../presentation/controllers/admin/AdminWalletController';
import { AdminProjectController } from '../../../presentation/controllers/admin/AdminProjectController';
import { AdminRoutes } from '../../../presentation/routes/admin/adminRoutes';
import { AdminSkillRoutes } from '../../../presentation/routes/admin/adminSkillRoutes';
import { AdminWalletRoutes } from '../../../presentation/routes/admin/AdminWalletRoutes';
import { AdminGetProjectDetailsUseCase } from '../../../application/useCases/admin/AdminGetProjectDetailsUseCase';
import { IAdminGetProjectDetailsUseCase } from '../../../application/useCases/admin/interfaces/IAdminGetProjectDetailsUseCase';
import { AdminSuspendProjectUseCase } from '../../../application/useCases/admin/AdminSuspendProjectUseCase';
import { IAdminSuspendProjectUseCase } from '../../../application/useCases/admin/interfaces/IAdminSuspendProjectUseCase';



/**
 * Binds all admin-related use cases, controllers, and routes
 */
export const bindAdminModule = (container: Container): void => {
  // Admin User Management Use Cases
  container.bind<IListUsersUseCase>(TYPES.IListUsersUseCase).to(ListUsersUseCase);
  container.bind<SuspendUserUseCase>(TYPES.SuspendUserUseCase).to(SuspendUserUseCase);
  container.bind<ISuspendUserUseCase>(TYPES.ISuspendUserUseCase).to(SuspendUserUseCase);
  container.bind<UnsuspendUserUseCase>(TYPES.UnsuspendUserUseCase).to(UnsuspendUserUseCase);
  container.bind<IUnsuspendUserUseCase>(TYPES.IUnsuspendUserUseCase).to(UnsuspendUserUseCase);

  // Admin Community Management Use Cases
  container.bind<IListCommunitiesUseCase>(TYPES.IListCommunitiesUseCase).to(ListCommunitiesUseCase);
  container.bind<IUpdateCommunityByAdminUseCase>(TYPES.IUpdateCommunityByAdminUseCase).to(UpdateCommunityByAdminUseCase);
  container.bind<IBlockCommunityUseCase>(TYPES.IBlockCommunityUseCase).to(BlockCommunityUseCase);
  container.bind<IUnblockCommunityUseCase>(TYPES.IUnblockCommunityUseCase).to(UnblockCommunityUseCase);

  // Admin Skill Management Use Cases
  container.bind<IListPendingSkillsUseCase>(TYPES.IListPendingSkillsUseCase).to(ListPendingSkillsUseCase);
  container.bind<IApproveSkillUseCase>(TYPES.IApproveSkillUseCase).to(ApproveSkillUseCase);
  container.bind<IRejectSkillUseCase>(TYPES.IRejectSkillUseCase).to(RejectSkillUseCase);
  container.bind<IGetAllSkillsUseCase>(TYPES.IGetAllSkillsUseCase).to(GetAllSkillsUseCase);
  container.bind<IBlockSkillUseCase>(TYPES.IBlockSkillUseCase).to(BlockSkillUseCase);
  container.bind<IUnblockSkillUseCase>(TYPES.IUnblockSkillUseCase).to(UnblockSkillUseCase);

  // Admin Wallet Use Cases
  container.bind<IGetAdminWalletStatsUseCase>(TYPES.IGetAdminWalletStatsUseCase).to(GetAdminWalletStatsUseCase);
  container.bind<IGetWalletTransactionsUseCase>(TYPES.IGetWalletTransactionsUseCase).to(GetWalletTransactionsUseCase);
  container.bind<ICreditAdminWalletUseCase>(TYPES.ICreditAdminWalletUseCase).to(CreditAdminWalletUseCase);

  // Admin Project Management Use Cases
  container.bind<IAdminListProjectsUseCase>(TYPES.IAdminListProjectsUseCase).to(AdminListProjectsUseCase);
  container.bind<IAdminGetProjectStatsUseCase>(TYPES.IAdminGetProjectStatsUseCase).to(AdminGetProjectStatsUseCase);
  container.bind<IAdminGetProjectDetailsUseCase>(TYPES.IAdminGetProjectDetailsUseCase).to(AdminGetProjectDetailsUseCase);
  container.bind<IAdminSuspendProjectUseCase>(TYPES.IAdminSuspendProjectUseCase).to(AdminSuspendProjectUseCase);

  // Controllers & Routes
  container.bind<AdminController>(TYPES.AdminController).to(AdminController);
  container.bind<AdminSkillController>(TYPES.AdminSkillController).to(AdminSkillController);
  container.bind<AdminWalletController>(TYPES.AdminWalletController).to(AdminWalletController);
  container.bind<AdminProjectController>(TYPES.AdminProjectController).to(AdminProjectController);
  container.bind<AdminRoutes>(TYPES.AdminRoutes).to(AdminRoutes);
  container.bind<AdminSkillRoutes>(TYPES.AdminSkillRoutes).to(AdminSkillRoutes);
  container.bind<AdminWalletRoutes>(TYPES.AdminWalletRoutes).to(AdminWalletRoutes);
};
