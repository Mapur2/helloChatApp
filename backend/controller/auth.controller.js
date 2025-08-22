import { createStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'

export async function signup(req, res) {
    const { email, password, fullName } = req.body;

    // Validate input
    if (!email || !password || !fullName) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const imageIdx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${imageIdx}.png`;

        // Create new user
        const newUser = new User({ email, password, fullName, profilePic: randomAvatar });
        await newUser.save();

        try {
            await createStreamUser({
                id: newUser._id.toString(),
                email: newUser.email,
                name: newUser.fullName,
                image: newUser.profilePic || ""
            })
        } catch (error) {
            console.error("Error creating Stream user:", error);
            return res.status(500).json({ message: "Failed to create Stream user" });
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict'//prevent CSRF attack
        });
        res.status(201).json({ success: true, message: "User created successfully", token, user: newUser });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict' //prevent CSRF attack
        });

        res.status(200).json({ success: true, message: "Login successful", token, user });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function logout(req, res) {
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboard(req, res) {
    const userId = req.user._id;
    try {
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;
        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean)
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            fullName,
            bio,
            nativeLanguage,
            learningLanguage,
            location,
            isOnboarded: true
        }, { new: true });

        if(!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        try {
            await createStreamUser({
                id: updatedUser._id.toString(),
                email: updatedUser.email,
                name: updatedUser.fullName,
                image: updatedUser.profilePic || ""
            });
        } catch (error) {
            console.error("Error creating Stream user during onboarding:", error);
            return res.status(500).json({ message: "Failed to update Stream user" });
        }
        res.status(200).json({ success: true, message: "Onboarding successful", updatedUser });
    } catch (error) {
        console.error("Error during onboarding:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
