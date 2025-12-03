import { Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/container';
import { TYPES } from '../../infrastructure/di/types';
import { IJWTService } from '../../domain/services/IJWTService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { errorResponse } from '../../shared/http/responseHelpers';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(' [authMiddleware] Checking authentication for:', req.method, req.path);
    console.log(' [authMiddleware] Cookies received:', req.cookies);
    console.log(' [authMiddleware] Authorization header:', req.headers.authorization);

    let token = req.cookies?.accessToken;
    console.log(' [authMiddleware] Token from cookie:', token ? 'Present' : 'Missing');

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log(' [authMiddleware] Token from Authorization header:', token ? 'Present' : 'Missing');
      }
    }

    if (!token) {
      console.error(' [authMiddleware] No token found in cookies or headers');
      const response = errorResponse(
        'UNAUTHORIZED',
        'No token provided',
        HttpStatusCode.UNAUTHORIZED
      );
      res.status(response.statusCode).json(response.body);
      return;
    }

    console.log(' [authMiddleware] Token found, verifying...');

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
    
    // CRITICAL: Check user's current active status from database
    // This ensures suspended users are immediately blocked even if they have a valid token
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const user = await userRepository.findById(decoded.userId);
    
    if (!user) {
      const response = errorResponse(
        'UNAUTHORIZED',
        'User not found',
        HttpStatusCode.UNAUTHORIZED
      );
      res.status(response.statusCode).json(response.body);
      return;
    }
    
    // Check if user is suspended or deleted
    if (!user.isActive || user.isDeleted) {
      // Clear cookies to force logout
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      });
      
      const response = errorResponse(
        'FORBIDDEN',
        'Your account has been suspended. Please contact support.',
        HttpStatusCode.FORBIDDEN
      );
      res.status(response.statusCode).json(response.body);
      return;
    }
    
    // Attach user data to request
    (req as any).user = {
      id: decoded.userId,
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    console.log(' [authMiddleware] User attached to request:', (req as any).user);
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