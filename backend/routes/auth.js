import express from "express";
import { pool } from "../database.js";
import bcrypt from "bcrypt";  //for hashing passwords
import jwt from "jsonwebtoken";

const router = express.Router();


router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = users[0];

        // Validate password (Since no hashing is used, compare directly)
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Ensure userRole is not null/undefined
        if (!user.userRole) {
            return res.status(400).json({ error: "User role is missing" });
        }

        // Generate token
        const token = jwt.sign(
            {
                id: user.id,
                studentid: user.studentid || null,  // Ensure studentid exists or set as null
                name: user.name,
                surname: user.surname,
                userRole: user.userRole,
                department_id: user.department_id || null
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, user });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;
