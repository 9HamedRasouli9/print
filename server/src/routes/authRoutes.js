import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, getMe);

export default router;
