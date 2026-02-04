import { RequestHandler } from 'express';

export interface IPassportService {
  initializePassport(): RequestHandler;
  authenticateGoogle(): RequestHandler;
  authenticateGoogleCallback(options: { failureRedirect: string }): RequestHandler;
}