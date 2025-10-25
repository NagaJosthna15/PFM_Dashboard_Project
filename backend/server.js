import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/database.js';
import { connectRedis } from './config/redis.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import plaidRoutes from './routes/plaidRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';


const __dirname = import.meta.dirname

dotenv.config({override: true, quiet: true});
console.log("Frontend URL: ", process.env.FRONTEND_URL)

const app = express();
const PORT = process.env.PORT;

// Connect to databases
connectDB();
connectRedis();



app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/", plaidRoutes);
app.use("/", dashboardRoutes);
app.use("/", budgetRoutes);
app.use("/", transactionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'PFM Dashboard API is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
