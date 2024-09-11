import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger';
import userRoutes from './routes/userRoutes';
import walletRoutes from './routes/walletRoutes';
import donationRoutes from './routes/donationRoutes';
import { connectDB } from './config/database';
import ErrorHandler from './middleware/error-handler';
import passport from './config/passport';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// Connect to MongoDB
connectDB();

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/donations', donationRoutes);
app.use("*", (req, res, next) => {
  res.status(404).json({ message: "route not found" });
});

app.use(ErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
