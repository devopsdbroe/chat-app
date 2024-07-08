import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // Check if token is found
        if (!token) {
            return res
                .status(401)
                .json({ error: "Unauthorized - No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if token is valid
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid token" });
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, fullName: true, profilePic: true },
        });
        // Check if user was found
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Create user field under req
        req.user = user;
        next();
    }
    catch (error) { }
};
export default protectRoute;
