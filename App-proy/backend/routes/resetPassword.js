import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/usuario.js';

const router = express.Router();

// Ruta para restablecer la contraseña
router.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario en la base de datos
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Actualizar la contraseña
    user.password = newPassword; // Se encripta automáticamente si tienes un hook en el esquema
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'El token ha expirado' });
    }
    res.status(500).json({ message: 'Error al restablecer la contraseña', error: error.message });
  }
});

export default router;
