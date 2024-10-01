import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Directorio de subida de archivos
const uploadDir = path.join(__dirname, '../../public/uploads');

// Asegura que el directorio de subida exista
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de multer para guardar archivos
const savePicture = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        if (file) {
            const ext = path.extname(file.originalname);
            const fileName = `${Date.now()}${ext}`;
            cb(null, fileName);
        }
    }
});

// Filtro de tipos de archivo aceptados
const filter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
}

export const upload = multer({ storage: savePicture, fileFilter: filter });