import express from 'express';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';
import  Reservation  from '../models/reservation.js';
import Dish from "../models/dish.js";
import User from "../models/usuario.js";

const router = express.Router();

// Obtener todas las reservas (filtro opcional por estado)
router.get('/admin/reservations', authenticateAdmin, async (req, res) => {
  const { status } = req.query; // Filtrar por estado si es necesario

  try {
    const query = status ? { status } : {}; // Filtro opcional
    const reservations = await Reservation.find(query).populate('user', 'name email').sort({ date: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas.', error });
  }
});

// Confirmar o cancelar reservas
router.put('/admin/reservations/:id', authenticateAdmin, async (req, res) => {
  const { status } = req.body;

  if (!['confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Estado inválido.' });
  }

  try {
    const reservation = await Reservation.findById(req.params.id);

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

// Eliminar reservas
router.delete('/admin/reservations/:id', authenticateAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    res.status(200).json({ message: 'Reserva eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la reserva.', error });
  }
});

// Obtener todos los usuarios
router.get('/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Excluir contraseña
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios.', error });
  }
});

// Bloquear o desbloquear un usuario
router.put('/admin/blockUser/:id', authenticateAdmin, async (req, res) => {
  const { block } = req.body; // true para bloquear, false para desbloquear

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    user.isBlocked = block;
    await user.save();

    res.status(200).json({ message: `Usuario ${block ? 'bloqueado' : 'desbloqueado'} correctamente.`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error al bloquear/desbloquear el usuario.', error });
  }
});

// Eliminar un usuario
router.delete('/admin/deleteUser/:id', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Usuario eliminado correctamente.', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario.', error });
  }
});

router.get('/admin/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
    const confirmedReservations = await Reservation.countDocuments({ status: 'confirmed' });
    const cancelledReservations = await Reservation.countDocuments({ status: 'cancelled' });
    const totalDishes = await Dish.countDocuments();
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalReservations,
      pendingReservations,
      confirmedReservations,
      cancelledReservations,
      totalDishes,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los datos del dashboard.', error });
  }
});

export default router;