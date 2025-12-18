"use strict";
// import multer, { Options, FileFilterCallback } from 'multer';
// import { Request } from 'express';
// import { ValidationError } from '../domain/errors/AppError';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImportFile = exports.uploadImage = void 0;
// const storage = multer.memoryStorage();
// // Image file filter for image uploads
// const imageFileFilter = (
//   _req: Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback
// ): void => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new ValidationError('Not an image! Please upload only images'));
//   }
// };
// // CSV file filter for MCQ bulk import
// const csvFileFilter = (
//   _req: Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback
// ): void => {
//   const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'application/csv'];
//   const allowedExtensions = ['.csv'];
//   const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
//   if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
//     cb(null, true);
//   } else {
//     cb(new ValidationError('Only CSV files are supported for bulk import'));
//   }
// };
// // Multer config for image uploads
// const imageMulterConfig: Options = {
//   storage: storage,
//   fileFilter: imageFileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
// };
// // Multer config for CSV uploads
// const csvMulterConfig: Options = {
//   storage: storage,
//   fileFilter: csvFileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB for CSV files
//   },
// };
// export const upload = multer(imageMulterConfig);
// export const uploadCSV = multer(csvMulterConfig);
const multer_1 = __importDefault(require("multer"));
const AppError_1 = require("../domain/errors/AppError");
const storage = multer_1.default.memoryStorage();
const imageFileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new AppError_1.ValidationError('Not an image ! Please upload only images'));
    }
};
const importFileFilter = (_req, file, cb) => {
    const allowedMimes = [
        'text/csv',
        'application/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetmal.sheet'
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        const isValidExt = file.originalname.match(/\.(csv|xlsx|xls)$/i);
        if (isValidExt) {
            cb(null, true);
        }
        else {
            cb(new AppError_1.ValidationError('Invalid file type. Plesase upload a CSV or Excel  filr.'));
        }
    }
};
exports.uploadImage = (0, multer_1.default)({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
exports.uploadImportFile = (0, multer_1.default)({
    storage: storage,
    fileFilter: importFileFilter,
    limits: {
        fileSize: 10 * 10124 * 1024
    }
});
//# sourceMappingURL=multer.js.map