import {app} from './src/app';
import connectDB from './src/config/db';

const port = process.env.PORT || 3001;

const start = async () => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

start();
