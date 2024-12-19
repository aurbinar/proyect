import express from 'express';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js'
import { Reservation } from '../models/reservation.js'

const router = express.Router();

// Ruta accesible solo para usuarios autenticados
router.get('/profile', authenticateAdmin, (req, res) => {
  res.status(200).json({ message: `Bienvenido, ${req.user.email}` });
});

// Ruta accesible solo para administradores
router.post('/admin/task', authenticateAdmin, authorizeAdmin, (req, res) => {
  res.status(200).json({ message: 'Acceso permitido, eres administrador' });
});

router.get('/admin/reservations', authenticateAdmin, authorizeAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find({ status: 'pending' }).populate('user', 'name email');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas.', error });
  }
});

router.put('/admin/reservations/:id', authenticateAdmin, authorizeAdmin, async (req, res) => {
  const { status } = req.body;

  if (!['confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Estado inválido.' });
  }

  try {
    const reservation = await reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    reservation.status = status;
    await reservation.save();

    res.status(200).json({ message: 'Estado de la reserva actualizado.', reservation });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado de la reserva.', error });
  }
});

export default router;