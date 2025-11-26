import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema, ZodIssue } from 'zod';
import { RegisterSchema } from '../../application/dto/auth/RegisterDTO';
import { LoginSchema } from '../../application/dto/auth/LoginDTO';
import { VerifyOtpSchema } from '../../application/dto/auth/VerifyOtpDTO';
import { ResendOtpSchema } from '../../application/dto/auth/ResendOtpDTO';
import { AdminLoginSchema } from '../../application/dto/auth/AdminLoginDTO';
import { HttpStatusCode } from '../../domain/enums/HttpStatusCode';
import { ValidationError } from '../../domain/errors/AppError';

export const registerSchema = RegisterSchema;
export const loginSchema = LoginSchema;
export const verifyOtpSchema = VerifyOtpSchema;
export const resendOtpSchema = ResendOtpSchema;
export const adminLoginSchema = AdminLoginSchema;

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue: ZodIssue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        (req as any).zodDetails = errors; // For errorHandler
        res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          error: 'Validation failed',
          details: errors,
        });
        return;
      }
      next(new ValidationError((error as Error).message));
    }
  };
};