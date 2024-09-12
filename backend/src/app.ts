import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import studentsRoutes from './routes/students.routes';
import reportsRoutes from './routes/reports.routes';
import connectDB from './config/db';
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/estudiantes', studentsRoutes);
app.use('/api/reportes', reportsRoutes);


const start = async () => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
    await connectDB(); 
    console.log('Database connected');
}

start();