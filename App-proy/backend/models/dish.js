import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema(
  {
    category: { type: String, required: true }, // ej: Entrantes, Carnes, etc.
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    allergens: [{ type: String }],
    image: { type: String } // URL de la imagen
  }
);

export default mongoose.model('Dish', dishSchema);