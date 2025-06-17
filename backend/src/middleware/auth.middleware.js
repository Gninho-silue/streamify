import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";


export const protectedRoute = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({message: "Unauthorized: No token provided"});        
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: Invalid token"})  
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found"})
        }

        req.user = user;
        next();
        
    } catch (error) {
        console.error("Error in protecting middleware", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
