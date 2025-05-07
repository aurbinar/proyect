import { Router } from "express";
import { register, login, recover, resetPass, getMe  } from '../controllers/authController.js';
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.post('/recover', recover);

router.post('/reset/:token', resetPass);

router.get('/me', authMiddleware, getMe);

export default router;

