import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';

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
    
    if (user.role !== 'admin') {
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