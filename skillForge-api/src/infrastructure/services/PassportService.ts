import { injectable } from 'inversify';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { env } from '../../config/env';

@injectable()
export class PassportService {
  constructor() {
    this.configureGoogleStrategy();
    this.setupSerialization();
  }

  private configureGoogleStrategy(): void {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_CALLBACK_URL) {
      console.warn('Google OAuth environment variables are missing. Skipping Google Auth setup.');
      return;
    }
    passport.use(
      new GoogleStrategy(
        {
          clientID: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          callbackURL: env.GOOGLE_CALLBACK_URL,
        },
        (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
          try {
            return done(null, profile);
          } catch (error) {
            return done(error as Error);
          }
        }
      )
    );
  }

  private setupSerialization(): void {
    passport.serializeUser((user: Express.User, done) => {
      const profile = user as Profile;
      done(null, profile.id);
    });
    passport.deserializeUser((id: string, done) => {
      done(null, { id } as Express.User);
    });
  }

  public initializePassport() {
    return passport.initialize();
  }

  public authenticateGoogle() {
    return passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false
    });
  }

  public authenticateGoogleCallback(options: { failureRedirect: string }) {
    return passport.authenticate('google', {
      failureRedirect: options.failureRedirect,
      session: false
    });
  }
}

declare global {
  namespace Express {
    interface User extends Profile {}
  }
}