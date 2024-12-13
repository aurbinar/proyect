import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';

const router = express.Router();

// Ruta accesible solo para usuarios autenticados
router.get('/profile', authenticateUser, (req, res) => {
  res.status(200).json({ message: `Bienvenido, ${req.user.email}` });
});

// Ruta accesible solo para administradores
router.post('/admin/task', authenticateUser, authorizeAdmin, (req, res) => {
  res.status(200).json({ message: 'Acceso permitido, eres administrador' });
});

export default router;