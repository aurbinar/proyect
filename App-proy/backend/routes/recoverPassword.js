import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/usuario.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// Ruta para solicitar el restablecimiento de contraseña
router.post('/recover', async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Correo no registrado' });

    // Generar un token JWT con tiempo de expiración
    const resetToken = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET, // Clave secreta
      { expiresIn: '1h' } // Expira en 1 hora
    );

    // Crear enlace de restablecimiento
    const resetLink = `http://localhost:3000/auth/reset/${resetToken}`;

    // Enviar correo al usuario
    await sendEmail(
        user.email,
        'Recuperación de contraseña',
        `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`
      );

    res.status(200).json({ message: 'Correo enviado con instrucciones para restablecer la contraseña' });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
  }
});

export default router;
