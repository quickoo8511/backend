import SuperAdmin from "../modals/SuperAdmin.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Helper function: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Signup Controller
export const signupSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await SuperAdmin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newAdmin = await SuperAdmin.create({ name, email, password });
    const token = generateToken(newAdmin._id);

    res.status(201).json({
      success: true,
      message: "SuperAdmin registered successfully",
      token,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Login Controller
export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await SuperAdmin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Logged In Admin (Protected)
export const getSuperAdminProfile = async (req, res) => {
  try {
    res.json(req.admin);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
