import express from 'express';
import Reservation from '../models/reservation.js';
import { authMiddleware } from '../middleware/auth.js'; // Asegura que el usuario está logeado
import  sendEmail  from '../utils/sendEmail.js'

const router = express.Router();
const MAX_RESERVATIONS_PER_SHIFT = 60;

// Crear una reserva
router.post('/create', authMiddleware, async (req, res) => {
    const { date, shift, people } = req.body;

    if (!date || !shift || !people) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
  
    const reservationDate = new Date(date);
    const currentDate = new Date();
  
    if (reservationDate < currentDate.setHours(0, 0, 0, 0)) {
      return res.status(400).json({ message: 'No se pueden hacer reservas en fechas pasadas.' });
    }

      // Comprobar si el turno ya está lleno
    const existingReservations = await Reservation.find({
        date: reservationDate,
        shift,
    });

    const totalPeople = existingReservations.reduce((sum, r) => sum + r.people, 0);

    if (totalPeople + people > MAX_RESERVATIONS_PER_SHIFT) {
        return res.status(400).json({ message: `El turno ${shift} ya está lleno. Intenta con otro turno o fecha.` });
    }
  
    try {
      const reservation = new Reservation({
        user: req.user._id,
        date: reservationDate,
        shift,
        people,
      });
  
      await reservation.save();

    // Enviar correo de confirmación
    const user = req.user;
    await sendEmail(
      user.email,
      'Confirmación de reserva',
      `Hola ${user.name}, tu reserva para el día ${reservationDate.toLocaleDateString()} en el turno ${shift} ha sido confirmada.`
    );
      res.status(201).json({ message: 'Reserva creada con éxito.', reservation });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la reserva.', error });
    }
});

// Ver las reservas del usuario
router.get('/my-reservations', authMiddleware, async (req, res) => {
    try {
      const reservations = await Reservation.find({ user: req.user._id }).sort({ date: 1 });
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las reservas.', error });
    }
});

  // Cancelar una reserva
router.delete('/cancel/:id', authMiddleware, async (req, res) => {
    try {
      const reservation = await Reservation.findById(req.params.id);
  
      if (!reservation) {
        return res.status(404).json({ message: 'Reserva no encontrada.' });
      }
  
      if (reservation.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'No estás autorizado para cancelar esta reserva.' });
      }
  
      reservation.status = 'cancelled';
      await reservation.save();
  
      res.status(200).json({ message: 'Reserva cancelada con éxito.', reservation });
    } catch (error) {
      res.status(500).json({ message: 'Error al cancelar la reserva.', error });
    }
});

export default router;
