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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const UserProfileController_1 = require("../../controllers/user/UserProfileController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const multer_1 = __importDefault(require("multer"));
// Configure multer for memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (_req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    },
});
let UserProfileRoutes = class UserProfileRoutes {
    constructor(userProfileController) {
        this.userProfileController = userProfileController;
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        // Apply auth middleware to all routes
        this.router.use(authMiddleware_1.authMiddleware);
        // GET /api/v1/profile - Get current user profile
        this.router.get('/', this.userProfileController.getProfile);
        // PUT /api/v1/profile - Update current user profile
        this.router.put('/', upload.single('avatar'), this.userProfileController.updateProfile);
    }
    getRouter() {
        return this.router;
    }
};
exports.UserProfileRoutes = UserProfileRoutes;
exports.UserProfileRoutes = UserProfileRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.UserProfileController)),
    __metadata("design:paramtypes", [UserProfileController_1.UserProfileController])
], UserProfileRoutes);
//# sourceMappingURL=userProfileRoutes.js.map