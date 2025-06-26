import express from "express";
import { registerUser, loginUser,verifyEmail } from "../controllers/auth";
import { validate } from "../middlewares/validate";
import { createUserSchema, loginUserSchema } from "../utils/validtionSchema";

const router = express.Router();

router.post("/register",validate(createUserSchema), registerUser);
router.post("/login",validate(loginUserSchema), loginUser);
router.get("/verify-email/:id", verifyEmail);

export default router;
