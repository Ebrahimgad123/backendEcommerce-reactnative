import app from './server';
import { connectDB } from './config/db';

connectDB(); 

export default app;
