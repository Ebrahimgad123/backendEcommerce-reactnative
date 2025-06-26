import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import { AppError } from './utils/AppError';
import {globalErrorHandler} from './utils/AppError';
import { connectDB } from './config/db';
import authRouter from './routes/auth';
import orderRouter from './routes/order';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Trust proxy (if deployed behind proxy like NGINX or Vercel)
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

// Connect DB
connectDB();
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is working ✅" });
});

// Routes
app.use('/auth', authRouter);
app.use('/orders', orderRouter);

// 404
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global Error
app.use(globalErrorHandler);

// Uncaught errors (safe fallback)
process.on("uncaughtException", err => {
  console.error("UNCAUGHT EXCEPTION 🔥", err);
  process.exit(1);
});
process.on("unhandledRejection", err => {
  console.error("UNHANDLED REJECTION 💥", err);
  process.exit(1);
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
