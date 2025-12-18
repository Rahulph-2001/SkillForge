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
exports.PassportService = void 0;
const inversify_1 = require("inversify");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("../../config/env");
let PassportService = class PassportService {
    constructor() {
        this.configureGoogleStrategy();
        this.setupSerialization();
    }
    configureGoogleStrategy() {
        if (!env_1.env.GOOGLE_CLIENT_ID || !env_1.env.GOOGLE_CLIENT_SECRET || !env_1.env.GOOGLE_CALLBACK_URL) {
            console.warn('Google OAuth environment variables are missing. Skipping Google Auth setup.');
            return;
        }
        passport_1.default.use(new passport_google_oauth20_1.Strategy({
            clientID: env_1.env.GOOGLE_CLIENT_ID,
            clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
            callbackURL: env_1.env.GOOGLE_CALLBACK_URL,
        }, (_accessToken, _refreshToken, profile, done) => {
            try {
                return done(null, profile);
            }
            catch (error) {
                return done(error);
            }
        }));
    }
    setupSerialization() {
        passport_1.default.serializeUser((user, done) => {
            const profile = user;
            done(null, profile.id);
        });
        passport_1.default.deserializeUser((id, done) => {
            done(null, { id });
        });
    }
    initializePassport() {
        return passport_1.default.initialize();
    }
    authenticateGoogle() {
        return passport_1.default.authenticate('google', {
            scope: ['profile', 'email'],
            session: false
        });
    }
    authenticateGoogleCallback(options) {
        return passport_1.default.authenticate('google', {
            failureRedirect: options.failureRedirect,
            session: false
        });
    }
};
exports.PassportService = PassportService;
exports.PassportService = PassportService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PassportService);
//# sourceMappingURL=PassportService.js.map