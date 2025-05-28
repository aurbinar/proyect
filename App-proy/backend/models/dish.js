import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema(
  {
    category: { type: String, required: true }, 
    name: { type: String, required: true },
    description: { type: String },
    price: { type: String, required: true },
    allergens: [{ type: String }],
    image: { type: String } 
  }
);

export default mongoose.model('Dish', dishSchema);