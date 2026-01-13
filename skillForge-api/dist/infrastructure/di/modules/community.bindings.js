"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindCommunityModule = void 0;
const types_1 = require("../types");
const CreateCommunityUseCase_1 = require("../../../application/useCases/community/CreateCommunityUseCase");
const UpdateCommunityUseCase_1 = require("../../../application/useCases/community/UpdateCommunityUseCase");
const GetCommunitiesUseCase_1 = require("../../../application/useCases/community/GetCommunitiesUseCase");
const GetCommunityDetailsUseCase_1 = require("../../../application/useCases/community/GetCommunityDetailsUseCase");
const JoinCommunityUseCase_1 = require("../../../application/useCases/community/JoinCommunityUseCase");
const LeaveCommunityUseCase_1 = require("../../../application/useCases/community/LeaveCommunityUseCase");
const SendMessageUseCase_1 = require("../../../application/useCases/community/SendMessageUseCase");
const GetCommunityMessagesUseCase_1 = require("../../../application/useCases/community/GetCommunityMessagesUseCase");
const PinMessageUseCase_1 = require("../../../application/useCases/community/PinMessageUseCase");
const UnpinMessageUseCase_1 = require("../../../application/useCases/community/UnpinMessageUseCase");
const DeleteMessageUseCase_1 = require("../../../application/useCases/community/DeleteMessageUseCase");
const RemoveCommunityMemberUseCase_1 = require("../../../application/useCases/community/RemoveCommunityMemberUseCase");
const AddReactionUseCase_1 = require("../../../application/useCases/community/AddReactionUseCase");
const RemoveReactionUseCase_1 = require("../../../application/useCases/community/RemoveReactionUseCase");
const GetCommunityMembersUseCase_1 = require("../../../application/useCases/community/GetCommunityMembersUseCase");
const CommunityController_1 = require("../../../presentation/controllers/community/CommunityController");
const communityRoutes_1 = require("../../../presentation/routes/community/communityRoutes");
/**
 * Binds all community-related use cases, controllers, and routes
 */
const bindCommunityModule = (container) => {
    // Community Use Cases
    container.bind(types_1.TYPES.ICreateCommunityUseCase).to(CreateCommunityUseCase_1.CreateCommunityUseCase);
    container.bind(types_1.TYPES.IUpdateCommunityUseCase).to(UpdateCommunityUseCase_1.UpdateCommunityUseCase);
    container.bind(types_1.TYPES.IGetCommunitiesUseCase).to(GetCommunitiesUseCase_1.GetCommunitiesUseCase);
    container.bind(types_1.TYPES.IGetCommunityDetailsUseCase).to(GetCommunityDetailsUseCase_1.GetCommunityDetailsUseCase);
    container.bind(types_1.TYPES.IJoinCommunityUseCase).to(JoinCommunityUseCase_1.JoinCommunityUseCase);
    container.bind(types_1.TYPES.ILeaveCommunityUseCase).to(LeaveCommunityUseCase_1.LeaveCommunityUseCase);
    container.bind(types_1.TYPES.IGetCommunityMembersUseCase).to(GetCommunityMembersUseCase_1.GetCommunityMembersUseCase);
    container.bind(types_1.TYPES.IRemoveCommunityMemberUseCase).to(RemoveCommunityMemberUseCase_1.RemoveCommunityMemberUseCase);
    // Message Use Cases
    container.bind(types_1.TYPES.ISendMessageUseCase).to(SendMessageUseCase_1.SendMessageUseCase);
    container.bind(types_1.TYPES.IGetCommunityMessagesUseCase).to(GetCommunityMessagesUseCase_1.GetCommunityMessagesUseCase);
    container.bind(types_1.TYPES.IPinMessageUseCase).to(PinMessageUseCase_1.PinMessageUseCase);
    container.bind(types_1.TYPES.IUnpinMessageUseCase).to(UnpinMessageUseCase_1.UnpinMessageUseCase);
    container.bind(types_1.TYPES.IDeleteMessageUseCase).to(DeleteMessageUseCase_1.DeleteMessageUseCase);
    container.bind(types_1.TYPES.IAddReactionUseCase).to(AddReactionUseCase_1.AddReactionUseCase);
    container.bind(types_1.TYPES.IRemoveReactionUseCase).to(RemoveReactionUseCase_1.RemoveReactionUseCase);
    // Controllers & Routes
    container.bind(types_1.TYPES.CommunityController).to(CommunityController_1.CommunityController);
    container.bind(types_1.TYPES.CommunityRoutes).to(communityRoutes_1.CommunityRoutes);
};
exports.bindCommunityModule = bindCommunityModule;
//# sourceMappingURL=community.bindings.js.map