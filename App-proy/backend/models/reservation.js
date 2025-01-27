import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Relación con el usuario
    ref: 'User',
    required: true,
  },
  date: {
    type: Date, // Fecha de la reserva
    required: true,
  },
  shift: {
    type: String, // Turno 
    enum: ['12:30-13:45', '13:45-15:00', '15:00-16:15'],
    required: true,
  },
  people: {
    type: Number, // Número de personas
    required: true,
    min: 2,
    max: 8, // Puedes ajustar este límite según la capacidad del restaurante
  },
  status: {
    type: String, // Estado de la reserva
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true, // Crea campos `createdAt` y `updatedAt`
});

export default mongoose.model('Reservation', reservationSchema);