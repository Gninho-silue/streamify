import express from 'express';
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from 'cors';


import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import notificationRoutes from './routes/notification.routes.js';
import groupRoutes from './routes/group.route.js';
import { connectDB } from './lib/db.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT;
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true })); 

const __dirname = path.resolve();

app.use(cors({
    origin: [process.env.CLIENT_URL, // Replace with your frontend URL
        "https://streamify-production-b0f0.up.railway.app"
     ],
    credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/groups", groupRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    })
}

app.listen(PORT, () => {
    
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})