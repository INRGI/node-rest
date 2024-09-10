import multer, { StorageEngine } from "multer";
import path from 'path';
import { Request } from "express";

const dest = path.resolve('tmp');

const storage: StorageEngine = multer.diskStorage({
    destination: (_req: Request, file: Express.Multer.File, callback:(error: Error | null, filename: string) => void) => {
        callback(null, dest);
    },
    filename: (_req: Request, file: Express.Multer.File, callback:(error: Error | null, filename: string) => void) => {
        callback(null, file.originalname);
    },
});

export const upload = multer({
    storage,
});