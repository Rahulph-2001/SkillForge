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
exports.JWTService = void 0;
const inversify_1 = require("inversify");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
let JWTService = class JWTService {
    constructor() {
        this.secret = env_1.env.JWT_SECRET;
        this.expiresIn = env_1.env.JWT_EXPIRES_IN;
        this.refreshSecret = env_1.env.JWT_REFRESH_SECRET;
        this.refreshExpiresIn = env_1.env.JWT_REFRESH_EXPIRES_IN;
    }
    generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.secret, {
            expiresIn: this.expiresIn,
        });
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secret);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
    generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.refreshSecret, {
            expiresIn: this.refreshExpiresIn,
        });
    }
    verifyRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.refreshSecret);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
};
exports.JWTService = JWTService;
exports.JWTService = JWTService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], JWTService);
//# sourceMappingURL=JWTService.js.map