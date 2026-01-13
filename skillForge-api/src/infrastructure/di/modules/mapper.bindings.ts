import { Container } from 'inversify';
import { TYPES } from '../types';
import { IAdminUserDTOMapper } from '../../../application/mappers/interfaces/IAdminUserDTOMapper';
import { AdminUserDTOMapper } from '../../../application/mappers/AdminUserDTOMapper';
import { IUserDTOMapper } from '../../../application/mappers/interfaces/IUserDTOMapper';
import { UserDTOMapper } from '../../../application/mappers/UserDTOMapper';
import { IPendingSkillMapper } from '../../../application/mappers/interfaces/IPendingSkillMapper';
import { PendingSkillMapper } from '../../../application/mappers/PendingSkillMapper';
import { ISubscriptionPlanMapper } from '../../../application/mappers/interfaces/ISubscriptionPlanMapper';
import { SubscriptionPlanMapper } from '../../../application/mappers/SubscriptionPlanMapper';
import { IAuthResponseMapper } from '../../../presentation/controllers/auth/interfaces/IAuthResponseMapper';
import { AuthResponseMapper } from '../../../presentation/controllers/auth/AuthResponseMapper';
import { ISkillMapper } from '../../../application/mappers/interfaces/ISkillMapper';
import { SkillMapper } from '../../../application/mappers/SkillMapper';
import { IBrowseSkillMapper } from '../../../application/mappers/interfaces/IBrowseSkillMapper';
import { BrowseSkillMapper } from '../../../application/mappers/BrowseSkillMapper';
import { ISkillDetailsMapper } from '../../../application/mappers/interfaces/ISkillDetailsMapper';
import { SkillDetailsMapper } from '../../../application/mappers/SkillDetailsMapper';
import { IBookingMapper } from '../../../application/mappers/interfaces/IBookingMapper';
import { BookingMapper } from '../../../application/mappers/BookingMapper';
import { IUsageRecordMapper } from '../../../application/mappers/interfaces/IUsageRecordMapper';
import { UsageRecordMapper } from '../../../application/mappers/UsageRecordMapper';
import { IUserSubscriptionMapper } from '../../../application/mappers/interfaces/IUserSubscriptionMapper';
import { UserSubscriptionMapper } from '../../../application/mappers/UserSubscriptionMapper';
import { IFeatureMapper } from '../../../application/mappers/interfaces/IFeatureMapper';
import { FeatureMapper } from '../../../application/mappers/FeatureMapper';
import { ICommunityMapper } from '../../../application/mappers/interfaces/ICommunityMapper';
import { CommunityMapper } from '../../../application/mappers/CommunityMapper';
import { ICommunityMessageMapper } from '../../../application/mappers/interfaces/ICommunityMessageMapper';
import { CommunityMessageMapper } from '../../../application/mappers/CommunityMessageMapper';

/**
 * Binds all mapper interfaces to their implementations
 */
export const bindMapperModule = (container: Container): void => {
  container.bind<IAdminUserDTOMapper>(TYPES.IAdminUserDTOMapper).to(AdminUserDTOMapper);
  container.bind<IUserDTOMapper>(TYPES.IUserDTOMapper).to(UserDTOMapper);
  container.bind<IPendingSkillMapper>(TYPES.IPendingSkillMapper).to(PendingSkillMapper);
  container.bind<ISubscriptionPlanMapper>(TYPES.ISubscriptionPlanMapper).to(SubscriptionPlanMapper);
  container.bind<IAuthResponseMapper>(TYPES.IAuthResponseMapper).to(AuthResponseMapper);
  container.bind<ISkillMapper>(TYPES.ISkillMapper).to(SkillMapper);
  container.bind<IBrowseSkillMapper>(TYPES.IBrowseSkillMapper).to(BrowseSkillMapper);
  container.bind<ISkillDetailsMapper>(TYPES.ISkillDetailsMapper).to(SkillDetailsMapper);
  container.bind<IBookingMapper>(TYPES.IBookingMapper).to(BookingMapper);
  container.bind<IUsageRecordMapper>(TYPES.IUsageRecordMapper).to(UsageRecordMapper);
  container.bind<IUserSubscriptionMapper>(TYPES.IUserSubscriptionMapper).to(UserSubscriptionMapper);
  container.bind<IFeatureMapper>(TYPES.IFeatureMapper).to(FeatureMapper);
  container.bind<ICommunityMapper>(TYPES.ICommunityMapper).to(CommunityMapper);
  container.bind<ICommunityMessageMapper>(TYPES.ICommunityMessageMapper).to(CommunityMessageMapper);
};

