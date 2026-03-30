import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import connectDb from './config/connectDb.js';

const app = express();

// Middleware   
app.use(express.json());
app.use(cors());

app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({ crossOriginIsolated: false }));

app.get('/', (req, res) => {
    res.json({ message: 'Server is running', port: process.env.PORT });
});


connectDb().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port `,process.env.PORT);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});
