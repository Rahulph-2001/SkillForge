import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { CommunityController } from '../../controllers/community/CommunityController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { uploadImage } from '../../../config/multer';
import { validateBody } from '../../middlewares/validationMiddleware';
import {
  createCommunitySchema,
  updateCommunitySchema,
  sendMessageSchema
} from '../../../application/validators/community/CommunityValidationSchemas';
import { optionalAuthMiddleware } from '../../middlewares/optionalAuthMiddleware';
import { ENDPOINTS } from '../../../config/routes';

@injectable()
export class CommunityRoutes {
  private router: Router;

  constructor(
    @inject(TYPES.CommunityController) private readonly communityController: CommunityController
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      ENDPOINTS.COMMUNITY.ROOT,
      authMiddleware,
      uploadImage.single('image'),
      validateBody(createCommunitySchema),
      this.communityController.createCommunity
    );

    this.router.put(
      ENDPOINTS.COMMUNITY.BY_ID,
      authMiddleware,
      uploadImage.single('image'),
      validateBody(updateCommunitySchema),
      this.communityController.updateCommunity
    );

    this.router.get(
      ENDPOINTS.COMMUNITY.ROOT,
      optionalAuthMiddleware,
      this.communityController.getCommunities
    );

    this.router.get(
      ENDPOINTS.COMMUNITY.BY_ID,
      optionalAuthMiddleware,
      this.communityController.getCommunityDetails
    );

    this.router.post(
      ENDPOINTS.COMMUNITY.JOIN,
      authMiddleware,
      this.communityController.joinCommunity
    );

    this.router.post(
      ENDPOINTS.COMMUNITY.LEAVE,
      authMiddleware,
      this.communityController.leaveCommunity
    );

    this.router.post(
      ENDPOINTS.COMMUNITY.MESSAGES,
      authMiddleware,
      uploadImage.single('file'),
      validateBody(sendMessageSchema),
      this.communityController.sendMessage
    );

    this.router.get(
      ENDPOINTS.COMMUNITY.MESSAGES,
      authMiddleware,
      this.communityController.getMessages
    );

    this.router.post(
      ENDPOINTS.COMMUNITY.PIN_MESSAGE,
      authMiddleware,
      this.communityController.pinMessage
    );

    this.router.post(
      ENDPOINTS.COMMUNITY.UNPIN_MESSAGE,
      authMiddleware,
      this.communityController.unpinMessage
    );

    this.router.delete(
      ENDPOINTS.COMMUNITY.DELETE_MESSAGE,
      authMiddleware,
      this.communityController.deleteMessage
    );

    // Reaction routes
    this.router.post(
      ENDPOINTS.COMMUNITY.REACTIONS,
      authMiddleware,
      this.communityController.addReaction
    );

    this.router.delete(
      ENDPOINTS.COMMUNITY.REMOVE_REACTION,
      authMiddleware,
      this.communityController.removeReaction
    );

    // New route for removing members
    this.router.delete(
      ENDPOINTS.COMMUNITY.REMOVE_MEMBER,
      authMiddleware,
      this.communityController.removeMember
    );

    // New route for getting members
    this.router.get(
      ENDPOINTS.COMMUNITY.MEMBERS,
      authMiddleware,
      this.communityController.getMembers
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
