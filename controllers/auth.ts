import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { AppError } from "../utils/AppError";
import path from "path";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ REGISTER
const registerUser = async (req: Request, res: Response, next: NextFunction) => {

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
     next(new AppError("Username, email, and password are required", 400));
     return
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
       next(new AppError("User with this email already exists", 409));
       return
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const emailToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );
    const verificationUrl = `${process.env.BACKEND_URL}/auth/verify-email/${emailToken}`;

    try {
      await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your email",
        html: `<h3>Hello ${username}</h3><p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`,
      });
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
       next(new AppError("Failed to send verification email", 500));
       return
    }

     res.status(201).json({
      success: true,
      message: "User registered. Please check your email to verify your account.",
    });
    return
  } catch (err) {
    next(err);
  }
};

// ✅ LOGIN
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
     next(new AppError("Email and password are required", 400));
     return
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
       next(new AppError("Invalid credentials", 401));
       return
    }

    if (!user.isVerified) {
       next(new AppError("Please verify your email first", 403));
       return
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       next(new AppError("Invalid credentials", 401));
       return
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }); // في الإنتاج حط secure: true و https

     res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
    return
  } catch (err) {
    next(err);
  }
};

// ✅ VERIFY EMAIL
const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.params.id as string;

  if (!token) return next(new AppError("Verification token missing", 400));

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id);

    if (!user) return next(new AppError("User not found", 404));
    if (user.isVerified) return next(new AppError("User already verified", 400));

    user.isVerified = true;
    await user.save();

    
    const filePath = path.join(__dirname, "../views/verified.html");
    return res.sendFile(filePath);
  } catch (err) {
    return next(new AppError("Invalid or expired token", 400));
  }
};

export { registerUser, loginUser, verifyEmail };
