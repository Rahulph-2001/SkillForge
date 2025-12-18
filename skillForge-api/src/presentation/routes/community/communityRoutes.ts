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
      '/',
      authMiddleware,
      uploadImage.single('image'),
      validateBody(createCommunitySchema),
      this.communityController.createCommunity
    );

    this.router.put(
      '/:id',
      authMiddleware,
      uploadImage.single('image'),
      validateBody(updateCommunitySchema),
      this.communityController.updateCommunity
    );

    this.router.get(
      '/',
      this.communityController.getCommunities
    );

    this.router.get(
      '/:id',
      this.communityController.getCommunityDetails
    );

    this.router.post(
      '/:id/join',
      authMiddleware,
      this.communityController.joinCommunity
    );

    this.router.post(
      '/:id/leave',
      authMiddleware,
      this.communityController.leaveCommunity
    );

    this.router.post(
      '/:id/messages',
      authMiddleware,
      uploadImage.single('file'),
      validateBody(sendMessageSchema),
      this.communityController.sendMessage
    );

    this.router.get(
      '/:id/messages',
      authMiddleware,
      this.communityController.getMessages
    );

    this.router.post(
      '/messages/:messageId/pin',
      authMiddleware,
      this.communityController.pinMessage
    );

    this.router.post(
      '/messages/:messageId/unpin',
      authMiddleware,
      this.communityController.unpinMessage
    );

    this.router.delete(
      '/messages/:messageId',
      authMiddleware,
      this.communityController.deleteMessage
    );

    // New route for removing members
    this.router.delete(
      '/:id/members/:memberId',
      authMiddleware,
      this.communityController.removeMember
    );

    // New route for getting members
    this.router.get(
      '/:id/members',
      authMiddleware,
      this.communityController.getMembers
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}