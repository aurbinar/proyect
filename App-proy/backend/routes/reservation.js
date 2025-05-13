import express from 'express';
import Reservation from '../models/reservation.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import  sendEmail  from '../utils/sendEmail.js';
import { phoneSchema } from '../schemas/validation.js';

const router = express.Router();
const MAX_RESERVATIONS_PER_SHIFT = 60;

// Crear una reserva
router.post('/create', optionalAuth, async (req, res) => {

  const { date, shift, people, phone, name, email } = req.body;

  if (!req.user) {
    const { error } = phoneSchema.validate(phone);
    if(error){
      console.log(error);
      return res.status(400).json({ message: error.details[0].message });
    }
  }

  if (!date || !shift || !people ) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

 if (!req.user && (!name || !email || !phone)) {
    return res.status(400).json({ message: 'Nombre y email son obligatorios si no estás registrado.' });
  }

  const reservationDate = new Date(date);
  const currentDate = new Date();

  if (reservationDate < currentDate.setHours(0, 0, 0, 0)) {
    return res.status(400).json({ message: 'No se pueden hacer reservas en fechas pasadas.' });
  }

  try {
    // Comprobar si el usuario ya tiene una reserva en la misma fecha
    if (req.user) {
      const existingReservation = await Reservation.findOne({
        user: req.user._id,
        date: reservationDate,
      });
    
      if (existingReservation) {
        return res.status(400).json({
          message: 'Ya tienes una reserva activa para esta fecha.',
        });
      }
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

    const reservation = new Reservation({
      user: req.user?._id || null,
      name: req.user?.name || name,
      email: req.user?.email || email,
      phone: req.user?.phone || phone,
      date: reservationDate,
      shift,
      people,
      status: req.user ? "confirmed" : "pending"
    });
  
    await reservation.save();

    // Enviar correo si hay email
    if (reservation.email) {
      await sendEmail(
        reservation.email,
        req.user ? 'Confirmación de reserva' : 'Reserva pendiente',
        `Hola ${reservation.name || 'cliente'}, tu reserva para el día ${reservationDate.toLocaleDateString()} en el turno ${shift} ha sido ${reservation.status}.`
      );
    }

    res.status(201).json({ message: 'Reserva creada con éxito.', reservation });

  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reserva.', error });
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

// Obtener reservas del cliente
router.get('/history', authMiddleware, async (req, res) => {
  try {
    // Obtiene el ID del usuario desde el token
    const user = req.user.id;
    // Busca todas las reservas del usuario y clasifícalas
    const reservations = await Reservation.find({ user })
      .sort({ status: -1, date: -1 }); // Primero "confirmed", luego las más recientes

    if (!reservations.length) {
      return res.status(404).json({ message: 'No se encontraron reservas.' });
    }

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas.', error: error.message });
  }
});

export default router;
