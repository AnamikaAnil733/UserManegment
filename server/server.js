import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authroutes.js';
import userRoutes from "./routes/userRoute.js"
import adminRoute from './routes/adminroutes.js';
import cookieParser from 'cookie-parser'





dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Update if different
    credentials: true
  }));
  
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoute);


const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
