import multer from 'multer';
import path from'path';
import fs from 'fs'; 


const uploadDir = 'uploads/documents';
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive: true});
};

//Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        //Generate unique file name with timestamp
        const uniqueuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueuffix + path.extname(file.originalname))
    }
});

// Filter for pdfs only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if(file.mimetype === 'application/pdf'){
        cb(null, true)
    }else{
        cb(new Error('Only PDF files are allowed'))
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})


