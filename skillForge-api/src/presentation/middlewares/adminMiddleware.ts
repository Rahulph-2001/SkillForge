import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { UserRole } from '../../domain/enums/UserRole';

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const user = (req as any).user; 
    if (!user) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }
    
    if (user.role !== UserRole.ADMIN) {
      res.status(HttpStatusCode.FORBIDDEN).json({
        success: false,
        error: 'Access denied. Admin privileges required.',
      });
      return;
    }
    next();
  } catch (error) {
    res.status(HttpStatusCode.FORBIDDEN).json({
      success: false,
      error: 'Authorization failed',
    });
  }
};