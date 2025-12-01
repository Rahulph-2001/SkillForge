import multer ,{Options, FileFilterCallback} from 'multer'
import {Request} from 'express'
import { ValidationError } from '../domain/errors/AppError'


const storage = multer.memoryStorage()


const fileFilter=(
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {
    if(file.mimetype.startsWith('image/')){
        cb(null,true)
    }else{
        cb(new ValidationError('Not an image! Please upload only images'))
    }
}

const multerConfig: Options = {
    storage:storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5* 1024 * 1024
    },
}

export const upload = multer(multerConfig)