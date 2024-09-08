import multer from "multer";
import path from 'path';

const dest = path.resolve('tmp');

const storage = multer.diskStorage({
    destination: dest,
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});

export const upload = multer({
    storage,
})