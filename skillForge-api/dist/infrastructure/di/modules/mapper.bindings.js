"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindMapperModule = void 0;
const types_1 = require("../types");
const AdminUserDTOMapper_1 = require("../../../application/mappers/AdminUserDTOMapper");
const UserDTOMapper_1 = require("../../../application/mappers/UserDTOMapper");
const PendingSkillMapper_1 = require("../../../application/mappers/PendingSkillMapper");
const SubscriptionPlanMapper_1 = require("../../../application/mappers/SubscriptionPlanMapper");
const AuthResponseMapper_1 = require("../../../presentation/controllers/auth/AuthResponseMapper");
const SkillMapper_1 = require("../../../application/mappers/SkillMapper");
const BrowseSkillMapper_1 = require("../../../application/mappers/BrowseSkillMapper");
const SkillDetailsMapper_1 = require("../../../application/mappers/SkillDetailsMapper");
const BookingMapper_1 = require("../../../application/mappers/BookingMapper");
const UsageRecordMapper_1 = require("../../../application/mappers/UsageRecordMapper");
const UserSubscriptionMapper_1 = require("../../../application/mappers/UserSubscriptionMapper");
const FeatureMapper_1 = require("../../../application/mappers/FeatureMapper");
const CommunityMapper_1 = require("../../../application/mappers/CommunityMapper");
const CommunityMessageMapper_1 = require("../../../application/mappers/CommunityMessageMapper");
const WalletTransactionMapper_1 = require("../../../application/mappers/WalletTransactionMapper");
/**
 * Binds all mapper interfaces to their implementations
 */
const bindMapperModule = (container) => {
    container.bind(types_1.TYPES.IAdminUserDTOMapper).to(AdminUserDTOMapper_1.AdminUserDTOMapper);
    container.bind(types_1.TYPES.IUserDTOMapper).to(UserDTOMapper_1.UserDTOMapper);
    container.bind(types_1.TYPES.IPendingSkillMapper).to(PendingSkillMapper_1.PendingSkillMapper);
    container.bind(types_1.TYPES.ISubscriptionPlanMapper).to(SubscriptionPlanMapper_1.SubscriptionPlanMapper);
    container.bind(types_1.TYPES.IAuthResponseMapper).to(AuthResponseMapper_1.AuthResponseMapper);
    container.bind(types_1.TYPES.ISkillMapper).to(SkillMapper_1.SkillMapper);
    container.bind(types_1.TYPES.IBrowseSkillMapper).to(BrowseSkillMapper_1.BrowseSkillMapper);
    container.bind(types_1.TYPES.ISkillDetailsMapper).to(SkillDetailsMapper_1.SkillDetailsMapper);
    container.bind(types_1.TYPES.IBookingMapper).to(BookingMapper_1.BookingMapper);
    container.bind(types_1.TYPES.IUsageRecordMapper).to(UsageRecordMapper_1.UsageRecordMapper);
    container.bind(types_1.TYPES.IUserSubscriptionMapper).to(UserSubscriptionMapper_1.UserSubscriptionMapper);
    container.bind(types_1.TYPES.IFeatureMapper).to(FeatureMapper_1.FeatureMapper);
    container.bind(types_1.TYPES.ICommunityMapper).to(CommunityMapper_1.CommunityMapper);
    container.bind(types_1.TYPES.ICommunityMessageMapper).to(CommunityMessageMapper_1.CommunityMessageMapper);
    container.bind(types_1.TYPES.IWalletTransactionMapper).to(WalletTransactionMapper_1.WalletTransactionMapper);
};
exports.bindMapperModule = bindMapperModule;
//# sourceMappingURL=mapper.bindings.js.map