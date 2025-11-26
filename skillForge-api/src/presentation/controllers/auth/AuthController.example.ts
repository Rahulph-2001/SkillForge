
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { handleAsync } from '../../middlewares/responseHandler';
import { SUCCESS_MESSAGES } from '../../../config/messages';

@injectable()
export class ExampleAuthController {
  constructor(
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) {}

  /**
   * Example: Success response with data
   */
  async exampleSuccess(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      // Your business logic here
      const data = { userId: '123', name: 'John Doe' };
      
      // Build success response
      const response = this.responseBuilder.success(
        data,
        SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS
      );
      
      // Send response
      res.status(response.statusCode).json(response.body);
    }, req, res, next);
  }

  /**
   * Example: Created response (201)
   */
  async exampleCreated(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      const newResource = { id: '456', name: 'New Resource' };
      
      const response = this.responseBuilder.created(
        newResource,
        'Resource created successfully'
      );
      
      res.status(response.statusCode).json(response.body);
    }, req, res, next);
  }

  /**
   * Example: Error handling via next(error)
   * The error middleware will handle it and return structured error response
   */
  async exampleErrorHandling(req: Request, res: Response, next: NextFunction): Promise<void> {
    await handleAsync(async () => {
      // If an error occurs, throw it or call next(error)
      // The error middleware will catch it and format it properly
      throw new Error('Something went wrong');
      // OR: next(new ValidationError('Invalid input'));
    }, req, res, next);
  }
}

