import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Relación con el usuario
    ref: 'User',
    required: false,
  },
  name: {
    type: String,
    required: function () { return !this.user; },
  },
  email: {
    type: String,
    required: function () { return !this.user; },
  },
  date: {
    type: Date, // Fecha de la reserva
    required: true,
  },
  shift: {
    type: String, // Turno 
    enum: ['1', '2', '3'],
    required: true,
  },
  people: {
    type: Number, // Número de personas
    required: true,
    min: 2,
    max: 8, // ajustar este límite según la capacidad del restaurante
  },
  status: {
    type: String, // Estado de la reserva
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  phone: {
    type: String,
    required: function () { return !this.user; },
  },
}, {
  timestamps: true, // Crea campos `createdAt` y `updatedAt`
});

export default mongoose.model('Reservation', reservationSchema);