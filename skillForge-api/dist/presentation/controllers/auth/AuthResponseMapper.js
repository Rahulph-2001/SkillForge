"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseMapper = void 0;
const inversify_1 = require("inversify");
const messages_1 = require("../../../config/messages");
let AuthResponseMapper = class AuthResponseMapper {
    mapRegisterResponse(email, expiresAt, message) {
        return {
            success: true,
            data: {
                email,
                expiresAt,
                message,
            },
        };
    }
    mapLoginResponse(userResponse, token, refreshToken) {
        return {
            success: true,
            data: {
                user: userResponse,
                token: token,
                refreshToken: refreshToken,
            },
        };
    }
    mapVerifyOtpResponse(userResponse, message, token, refreshToken) {
        return {
            success: true,
            data: {
                user: userResponse,
                message: message,
                token: token,
                refreshToken: refreshToken,
            },
        };
    }
    mapLogoutResponse() {
        return {
            success: true,
            data: {
                message: messages_1.SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS,
            },
        };
    }
};
exports.AuthResponseMapper = AuthResponseMapper;
exports.AuthResponseMapper = AuthResponseMapper = __decorate([
    (0, inversify_1.injectable)()
], AuthResponseMapper);
//# sourceMappingURL=AuthResponseMapper.js.map