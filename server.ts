import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import { AppError, globalErrorHandler } from './utils/AppError';
import { connectDB } from './config/db';
import authRouter from './routes/auth';
import orderRouter from './routes/order';

dotenv.config();

const app = express();

// Connect DB (مرة واحدة فقط)
connectDB();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// Routes
app.use('/auth', authRouter);
app.use('/orders', orderRouter);

// 404
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

// Export as serverless function
export const handler = serverless(app);
