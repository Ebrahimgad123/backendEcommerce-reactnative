import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import { AppError } from './utils/AppError';
import { globalErrorHandler } from './utils/AppError';
import { connectDB } from './config/db';
import authRouter from './routes/auth';
import orderRouter from './routes/order';
import userRouter from './routes/users';
import ProductRouter from './routes/products';
import path from "path"
dotenv.config();
const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3001",
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, '../api/uploads')));

connectDB();

// Test Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is working ✅" });
});

// Routes
app.use('/auth', authRouter);
app.use('/orders', orderRouter);
app.use('/users', userRouter);
app.use("/products",ProductRouter)
// 404
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error
app.use(globalErrorHandler);

export default app;
