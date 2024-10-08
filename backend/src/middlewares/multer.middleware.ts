import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del almacenamiento
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        console.log(`Subiendo imagen: ${file.originalname}`);
        return {
            folder: 'uploads', // Cambia esto según tu estructura de carpetas
            format: file.mimetype.split('/')[1],
            public_id: `${Date.now()}-${file.originalname}`,
            transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto:good' }],
            type: 'authenticated',
        };
    },
});

// Filtrar tipos de archivos
const filter = (req: any, file: any, cb: any) => {
    if (['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

// Exportar middleware
export const upload = multer({ storage, fileFilter: filter });
