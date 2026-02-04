"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
    DATABASE_URL: process.env.DATABASE_URL ||
        'postgresql://user:password@localhost:5432/skillswap?schema=public',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
    JWT_SECRET: process.env.JWT_SECRET || 'your-very-strong-access-token-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ||
        'your-very-strong-refresh-token-secret-key',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
    EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM || 'SkillSwap <noreply@skillswap.com>',
    OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES || '2', 10),
    OTP_MAX_ATTEMPTS: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10),
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    AUTH_RATE_LIMIT_WINDOW_MS: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10),
    AUTH_RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '5', 10),
    OTP_RATE_LIMIT_WINDOW_MS: parseInt(process.env.OTP_RATE_LIMIT_WINDOW_MS || '3600000', 10),
    OTP_RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.OTP_RATE_LIMIT_MAX_REQUESTS || '3', 10),
    PASSWORD_RESET_RATE_LIMIT_WINDOW_MS: parseInt(process.env.PASSWORD_RESET_RATE_LIMIT_WINDOW_MS || '3600000', 10),
    PASSWORD_RESET_RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.PASSWORD_RESET_RATE_LIMIT_MAX_REQUESTS || '3', 10),
    DEFAULT_BONUS_CREDITS: parseInt(process.env.DEFAULT_BONUS_CREDITS || '20', 10),
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/google/callback',
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || 'skillforge-uploads',
    // Stripe Configuration
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    // WebRTC STUN/TURN Configuration
    STUN_SERVER: process.env.STUN_SERVER || 'stun:stun.l.google.com:19302',
    TURN_SERVER: process.env.TURN_SERVER || '',
    TURN_USERNAME: process.env.TURN_USERNAME || '',
    TURN_CREDENTIAL: process.env.TURN_CREDENTIAL || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    // Cookie Max Age Configuration (in milliseconds)
    ACCESS_TOKEN_COOKIE_MAX_AGE: parseInt(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE || String(15 * 60 * 1000), // 15 minutes default
    10),
    REFRESH_TOKEN_COOKIE_MAX_AGE: parseInt(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE || String(30 * 24 * 60 * 60 * 1000), // 30 days default
    10),
    GOOGLE_REFRESH_TOKEN_COOKIE_MAX_AGE: parseInt(process.env.GOOGLE_REFRESH_TOKEN_COOKIE_MAX_AGE || String(7 * 24 * 60 * 60 * 1000), // 7 days default
    10),
};
//# sourceMappingURL=env.js.map