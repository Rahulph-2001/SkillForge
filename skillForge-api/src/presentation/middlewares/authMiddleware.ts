import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/container';
import { TYPES } from '../../infrastructure/di/types';
import { IJWTService } from '../../domain/services/IJWTService';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { errorResponse } from '../../shared/http/responseHelpers';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
   
    let token = req.cookies?.accessToken;
    
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      const response = errorResponse(
        'UNAUTHORIZED',
        'No token provided',
        HttpStatusCode.UNAUTHORIZED
      );
      res.status(response.statusCode).json(response.body);
      return;
    }
    
    // Verify token
    const jwtService = container.get<IJWTService>(TYPES.IJWTService);
    const decoded = jwtService.verifyToken(token);
    
    if (!decoded) {
      const response = errorResponse(
        'UNAUTHORIZED',
        'Invalid or expired token',
        HttpStatusCode.UNAUTHORIZED
      );
      res.status(response.statusCode).json(response.body);
      return;
    }
    
    // Attach user data to request
    (req as any).user = decoded;
    next();
  } catch (error) {
    const response = errorResponse(
      'UNAUTHORIZED',
      'Authentication failed',
      HttpStatusCode.UNAUTHORIZED
    );
    res.status(response.statusCode).json(response.body);
  }
};