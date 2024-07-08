import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { modifyFullName } from "../utils/stringUtils.js";
export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword } = req.body;
        // Check if all fields have been filled
        if (!fullName || !username || !password || !confirmPassword) {
            return res.status(400).json({ error: "Please fill in all fields" });
        }
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        // Check if username has already been taken
        const user = await prisma.user.findUnique({ where: { username } });
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }
        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        // Format full name for URL
        const formattedName = modifyFullName(fullName);
        const profilePic = `https://avatar.iran.liara.run/username?username=${formattedName}`;
        // Create new user in Prisma
        const newUser = await prisma.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                profilePic,
            },
        });
        // If newUser has been created successfully, generate a JWT token
        if (newUser) {
            // Generate token
            generateToken(newUser.id, res);
            res.status(200).json({
                id: newUser.id,
                fullname: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Fetch user from Prisma
        const user = await prisma.user.findUnique({ where: { username } });
        // Check if user exists
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        // Check if password is correct
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        generateToken(user.id, res);
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const logout = async (req, res) => {
    try {
        // Clear cookie
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
