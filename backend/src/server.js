import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser'; 
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import path from 'path';//this is used to serve static files in production
dotenv.config();
const PORT=process.env.PORT || 5000;
const app = express();
const __dirname = path.resolve(); // Get the current directory name
app.use(cors({
  origin:"http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}))
app.use(express.json()); 
app.use(cookieParser());
 // Middleware to parse cookies
app.use("/api/auth",authRoutes) // Middleware to parse JSON bodies
app.use("/api/user",userRoutes)
app.use('/api/chat',chatRoutes)
if(process.env.NODE_ENV === 'production') {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}
app.listen(PORT, () => {
  console.log('Server is running on port 5000');
  connectDB()
  .then(() => console.log('Database connected successfully'))
})