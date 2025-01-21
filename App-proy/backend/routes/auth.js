import { Router } from "express";
import { register, login, recover, resetPass } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.post('/recover', recover);

router.post('/reset/:token', resetPass);

export default router;

