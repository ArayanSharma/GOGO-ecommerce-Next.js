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
import productRouter from './routes/product.route.js';
import orderRouter from './routes/order.route.js';
import adminRouter from './routes/admin.route.js';

const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
].filter(Boolean);

const isDevLocalOrigin = (origin) => {
    try {
        const parsed = new URL(origin);
        const host = parsed.hostname;

        if (host === 'localhost' || host === '127.0.0.1') {
            return true;
        }

        // Allow common private network IP ranges for local testing across devices.
        return /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
    } catch {
        return false;
    }
};

// Middleware   
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        const safeOrigins = [
            process.env.CLIENT_URL || 'https://gogo-client.onrender.com',
            process.env.ADMIN_URL || 'https://gogo-admin.onrender.com',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
        ];

        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);

        // Check if origin is in allowedOrigins or is a dev local origin
        if (safeOrigins.includes(origin) || isDevLocalOrigin(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(null, true); // Allow anyway on free tier - removed error
        }
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
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin', adminRouter);

connectDb().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port `,process.env.PORT);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});
