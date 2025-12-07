"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const inversify_1 = require("inversify");
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../../config/env");
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: env_1.env.EMAIL_HOST,
            port: env_1.env.EMAIL_PORT,
            secure: env_1.env.EMAIL_SECURE,
            auth: {
                user: env_1.env.EMAIL_USER,
                pass: env_1.env.EMAIL_PASSWORD,
            },
        });
    }
    async sendOTPEmail(email, otpCode, userName) {
        const mailOptions = {
            from: env_1.env.EMAIL_FROM,
            to: email,
            subject: 'Verify Your Email - SkillSwap',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Welcome to SkillSwap!</h1>
            <p>Hi ${userName},</p>
            <p>Thank you for signing up! Please verify your email address using the OTP code below:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h2 style="color: #2563eb; font-size: 32px; letter-spacing: 5px; margin: 0;">${otpCode}</h2>
            </div>
            <p>This code will expire in ${env_1.env.OTP_EXPIRY_MINUTES} minutes.</p>
            <p>If you didn't create an account, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">© ${new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
    async sendWelcomeEmail(email, userName) {
        const mailOptions = {
            from: env_1.env.EMAIL_FROM,
            to: email,
            subject: 'Welcome to SkillSwap!',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Welcome to SkillSwap, ${userName}!</h1>
            <p>Your email has been verified successfully. You're all set to start your learning journey!</p>
            <p>You've received <strong>${env_1.env.DEFAULT_BONUS_CREDITS} free credits</strong> to get started. Explore skills, book sessions, and start learning!</p>
            <p style="margin-top: 30px;">
              <a href="${env_1.env.FRONTEND_URL}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Get Started
              </a>
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">© ${new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Error sending welcome email:', error);
        }
    }
    async sendPasswordResetOTPEmail(email, otpCode, userName) {
        const mailOptions = {
            from: env_1.env.EMAIL_FROM,
            to: email,
            subject: 'Password Reset - SkillSwap',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Password Reset Request</h1>
            <p>Hi ${userName},</p>
            <p>We received a request to reset your password. Use the OTP code below to verify your identity:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h2 style="color: #2563eb; font-size: 32px; letter-spacing: 5px; margin: 0;">${otpCode}</h2>
            </div>
            <p>This code will expire in ${env_1.env.OTP_EXPIRY_MINUTES} minutes.</p>
            <p><strong>If you didn't request a password reset, please ignore this email. Your account remains secure.</strong></p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">© ${new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Failed to send email');
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=EmailService.js.map