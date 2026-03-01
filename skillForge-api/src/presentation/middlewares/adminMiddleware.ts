import { type Request, type Response, type NextFunction } from 'express';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { UserRole } from '../../domain/enums/UserRole';

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = req.user;
    if (!user) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if ((user.role as UserRole) !== UserRole.ADMIN) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        success: false,
        error: 'Access denied. Admin privileges required.',
      });
      return;
    }
    next();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(HttpStatusCode.FORBIDDEN).json({
      success: false,
      error: 'Authorization failed',
    });
  }
};