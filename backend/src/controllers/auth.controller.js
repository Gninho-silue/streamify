import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser, generateStreamToken } from "../lib/stream.js";

export async function signup(req, res) {
   const { email, password, fullName } = req.body;

   try {
        if (!email || !password || !fullName) {
            return res.status(400).json({message: "All fields are required !"});
        }
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message: "User already exists with this email, please login"});
        }

        const index = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePicture: randomAvatar
        });

        try {
            await upsertStreamUser({ 
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePicture || "",
            }); 
            console.log(`Stream user creating successfully for ${newUser.fullName}`); 

        } catch (error) {
            console.error("Error creating Stream user:", error);
            
        }  

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        )

        res.cookie("token", token, {
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            httpOnly: true,
            sameSite: "strict", // Helps prevent CSRF attacks
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        });
        

        res.status(201).json({success: true, user: newUser });

   } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
   }
}

export async function login(req, res) {
   try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid email or password" });
    
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        res.cookie("token", token, {
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            httpOnly: true, // Prevent XSS attacks by not allowing client-side scripts to access the cookie
            sameSite: "strict", // Helps prevent CSRF attacks
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        });

        res.status(200).json({ success: true, user });
   } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
   }
}

export function logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export async function onboard(req, res) {
    try {
        const userId = req.user._id;

        const {fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean),
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
           ...req.body,
           isOnBoarded: true, 
        }, {new: true})
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found"});
        }

        try {
         await upsertStreamUser({
            id: updatedUser._id,
            name: updatedUser.fullName,
            image: updatedUser.profilePicture || ""
         });
         
        
       } catch (streamError) {
        console.error("Error updating Stream user during onboarding:", streamError.message)
       }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Onboarding error:", error);
        res.status(500).json( { message: "Internal Server Error"})
    }
}

// Generate Stream.io tokens
export async function getStreamTokens(req, res) {
    try {
        const userId = req.user._id.toString();
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate Stream Chat token
        const chatToken = generateStreamToken(userId);
        
        // Generate Stream Video token (same token can be used for both)
        const videoToken = generateStreamToken(userId);

        // Upsert user to Stream
        await upsertStreamUser({
            id: userId,
            name: user.fullName,
            image: user.profilePicture,
        });

        res.status(200).json({
            chatToken,
            videoToken,
            userId: userId.toString()
        });
    } catch (error) {
        console.error("Error generating Stream tokens:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}