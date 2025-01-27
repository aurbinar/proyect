import express from 'express';
import User from '../models/usuario.js';
import { authMiddleware } from '../middleware/auth.js'; 

const router = express.Router();

// Ruta para editar perfil
router.put('/edit', authMiddleware, async (req, res) => {
    const userId = req.user._id; // Extraer ID del usuario autenticado
    const { name, phone } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, phone },
            { new: true }
        );

         res.status(200).json({ message: 'Perfil actualizado exitosamente', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
    }
});

router.put('/changePass', authMiddleware, async (req, res) => {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);

        // Verificar la contraseña antigua
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) return res.status(400).json({ message: 'Contraseña antigua incorrecta' });

        // Cambiar a la nueva contraseña
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar la contraseña', error: error.message });
    }
    });

export default router;