import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import quizRoutes from './routes/quiz.routes';
import userRoutes from './routes/user.routes';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser"
import passport from 'passport';
import './config/passport.config';
dotenv.config();

export const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

//parsers
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use('/api/quizzes', quizRoutes);

app.get('/', (_, res) => res.send('Backend running'));

export default app;