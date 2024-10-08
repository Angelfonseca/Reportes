import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import studentModel from '../models/students.model';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: any, file: Express.Multer.File) => {
        console.log(`Subiendo imagen: ${file.originalname}`);
        return {
            folder: 'uploads',
            format: file.mimetype.split('/')[1],
            public_id: `${Date.now()}-${file.originalname}`,
            transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto:good' }],
        };
    },
});


const filter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

export const upload = multer({ storage, fileFilter: filter });


