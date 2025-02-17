import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // extract token

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

export const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.userRole)) {
            return res.status(403).json({ error: "Forbidden: Access denied" });
        }
        next(); 
    };
};
