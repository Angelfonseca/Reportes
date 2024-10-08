import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import studentsRoutes from './routes/students.routes';
import reportsRoutes from './routes/reports.routes';
import teachersRoutes from './routes/teachers.routes';
import connectDB from './config/db';

import ensureAuth from './middlewares/auth.middleware';
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/estudiantes', studentsRoutes);
app.use('/api/reportes', reportsRoutes);
app.use('/uploads', express.static('public/uploads'), ensureAuth);
app.use('/api/maestros', teachersRoutes);



const start = async () => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
    await connectDB(); 
    console.log('Database connected');
}

start();