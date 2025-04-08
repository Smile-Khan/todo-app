import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ✅ Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Protected Profile Route
router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ message: "User profile data", user });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
