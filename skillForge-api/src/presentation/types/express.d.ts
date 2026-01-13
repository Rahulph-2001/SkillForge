/// <reference types="express" />

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userId: string;
        email: string;
        role: string;
      };
      zodDetails?: unknown; // For validation error details
    }
  }
}

export {};

