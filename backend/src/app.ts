import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import studentsRoutes from './routes/students.routes';
import reportsRoutes from './routes/reports.routes';
import connectDB from './config/db';
import { v2 as cloudinary } from 'cloudinary';
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/estudiantes', studentsRoutes);
app.use('/api/reportes', reportsRoutes);
app.use('/uploads', express.static('public/uploads'));


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const start = async () => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
    await connectDB(); 
    console.log('Database connected');
}

start();