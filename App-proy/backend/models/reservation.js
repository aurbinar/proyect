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
    type: String, // Turno (ej.: "1:00-2:30" o "2:30-4:00")
    enum: ['1:00-2:30', '2:30-4:00'],
    required: true,
  },
  people: {
    type: Number, // Número de personas
    required: true,
    min: 1,
    max: 20, // Puedes ajustar este límite según la capacidad del restaurante
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