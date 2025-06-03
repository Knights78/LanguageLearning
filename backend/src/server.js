import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
dotenv.config();
const PORT=process.env.PORT || 5000;
const app = express();
app.use(express.json()); 
app.use("/api/auth",authRoutes) // Middleware to parse JSON bodies
app.listen(PORT, () => {
  console.log('Server is running on port 5000');
  connectDB()
  .then(() => console.log('Database connected successfully'))
})