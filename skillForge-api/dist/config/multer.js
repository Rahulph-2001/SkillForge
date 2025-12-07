"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCSV = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const AppError_1 = require("../domain/errors/AppError");
const storage = multer_1.default.memoryStorage();
// Image file filter for image uploads
const imageFileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new AppError_1.ValidationError('Not an image! Please upload only images'));
    }
};
// CSV file filter for MCQ bulk import
const csvFileFilter = (_req, file, cb) => {
    const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'application/csv'];
    const allowedExtensions = ['.csv'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    }
    else {
        cb(new AppError_1.ValidationError('Only CSV files are supported for bulk import'));
    }
};
// Multer config for image uploads
const imageMulterConfig = {
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
};
// Multer config for CSV uploads
const csvMulterConfig = {
    storage: storage,
    fileFilter: csvFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB for CSV files
    },
};
exports.upload = (0, multer_1.default)(imageMulterConfig);
exports.uploadCSV = (0, multer_1.default)(csvMulterConfig);
//# sourceMappingURL=multer.js.map