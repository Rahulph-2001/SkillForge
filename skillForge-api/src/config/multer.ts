// import multer, { Options, FileFilterCallback } from 'multer';
// import { Request } from 'express';
// import { ValidationError } from '../domain/errors/AppError';

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




import multer, { Options, FileFilterCallback } from 'multer';
import { Request } from 'express';
import { ValidationError } from '../domain/errors/AppError';


const storage = multer.memoryStorage();

const communityFileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    // Videos
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError('Invalid file type! Please upload images, videos, or documents (PDF, DOC, DOCX)'));
  }
};

const importFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedMimes = [
    'text/csv',
    'application/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetmal.sheet'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    const isValidExt = file.originalname.match(/\.(csv|xlsx|xls)$/i)
    if (isValidExt) {
      cb(null, true)
    } else {
      cb(new ValidationError('Invalid file type. Plesase upload a CSV or Excel  filr.'))
    }
  }
}

export const uploadImage = multer({
  storage: storage,
  fileFilter: communityFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB for videos
  }
})

export const uploadImportFile = multer({
  storage: storage,
  fileFilter: importFileFilter,
  limits: {
    fileSize: 10 * 10124 * 1024
  }
})