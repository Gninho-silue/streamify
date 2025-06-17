import express from 'express';
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from 'cors';


import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import notificationRoutes from './routes/notification.routes.js';
import { connectDB } from './lib/db.js';

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: process.env.CLIENT_URL, // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
    
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})