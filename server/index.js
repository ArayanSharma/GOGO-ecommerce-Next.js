import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import connectDb from './config/connectDb.js';

import userRouter from './routes/user.route.js';
import homeSliderRouter from './routes/homeSlider.route.js';

const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:3001',
].filter(Boolean);

// Middleware   
app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        // Allow non-browser requests (no Origin header), like server-to-server or Postman.
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({ crossOriginIsolated: false }));

// Serve uploaded files as static
app.use('/upload', express.static('upload'));

app.get('/', (req, res) => {
    res.json({ message: 'Server is running', port: process.env.PORT });
});

app.use('/api/users', userRouter);
app.use('/api/sliders', homeSliderRouter);

connectDb().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port `,process.env.PORT);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});
