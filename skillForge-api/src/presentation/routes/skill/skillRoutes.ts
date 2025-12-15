import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { SkillController } from '../../controllers/skill/SkillController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { uploadImage } from '../../../config/multer';

@injectable()
export class SkillRoutes {
  public readonly router: Router = Router();

  constructor(
    @inject(TYPES.SkillController) private readonly skillController: SkillController
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(authMiddleware);


    this.router.post(
      '/',
      uploadImage.single('image'),
      this.skillController.create
    );


    this.router.get(
      '/me',
      this.skillController.listMySkills
    );

    this.router.put(
      '/:id',
      uploadImage.single('image'),
      this.skillController.update
    );

    this.router.patch(
      '/:id/block',
      this.skillController.toggleBlock
    );
  }
}