"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const CommunityController_1 = require("../../controllers/community/CommunityController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const multer_1 = require("../../../config/multer");
const validationMiddleware_1 = require("../../middlewares/validationMiddleware");
const CommunityValidationSchemas_1 = require("../../../application/validators/community/CommunityValidationSchemas");
const optionalAuthMiddleware_1 = require("../../middlewares/optionalAuthMiddleware");
let CommunityRoutes = class CommunityRoutes {
    constructor(communityController) {
        this.communityController = communityController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/', authMiddleware_1.authMiddleware, multer_1.uploadImage.single('image'), (0, validationMiddleware_1.validateBody)(CommunityValidationSchemas_1.createCommunitySchema), this.communityController.createCommunity);
        this.router.put('/:id', authMiddleware_1.authMiddleware, multer_1.uploadImage.single('image'), (0, validationMiddleware_1.validateBody)(CommunityValidationSchemas_1.updateCommunitySchema), this.communityController.updateCommunity);
        this.router.get('/', optionalAuthMiddleware_1.optionalAuthMiddleware, this.communityController.getCommunities);
        this.router.get('/:id', optionalAuthMiddleware_1.optionalAuthMiddleware, this.communityController.getCommunityDetails);
        this.router.post('/:id/join', authMiddleware_1.authMiddleware, this.communityController.joinCommunity);
        this.router.post('/:id/leave', authMiddleware_1.authMiddleware, this.communityController.leaveCommunity);
        this.router.post('/:id/messages', authMiddleware_1.authMiddleware, multer_1.uploadImage.single('file'), (0, validationMiddleware_1.validateBody)(CommunityValidationSchemas_1.sendMessageSchema), this.communityController.sendMessage);
        this.router.get('/:id/messages', authMiddleware_1.authMiddleware, this.communityController.getMessages);
        this.router.post('/messages/:messageId/pin', authMiddleware_1.authMiddleware, this.communityController.pinMessage);
        this.router.post('/messages/:messageId/unpin', authMiddleware_1.authMiddleware, this.communityController.unpinMessage);
        this.router.delete('/messages/:messageId', authMiddleware_1.authMiddleware, this.communityController.deleteMessage);
        // Reaction routes
        this.router.post('/messages/:messageId/reactions', authMiddleware_1.authMiddleware, this.communityController.addReaction);
        this.router.delete('/messages/:messageId/reactions/:emoji', authMiddleware_1.authMiddleware, this.communityController.removeReaction);
        // New route for removing members
        this.router.delete('/:id/members/:memberId', authMiddleware_1.authMiddleware, this.communityController.removeMember);
        // New route for getting members
        this.router.get('/:id/members', authMiddleware_1.authMiddleware, this.communityController.getMembers);
    }
    getRouter() {
        return this.router;
    }
};
exports.CommunityRoutes = CommunityRoutes;
exports.CommunityRoutes = CommunityRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CommunityController)),
    __metadata("design:paramtypes", [CommunityController_1.CommunityController])
], CommunityRoutes);
//# sourceMappingURL=communityRoutes.js.map