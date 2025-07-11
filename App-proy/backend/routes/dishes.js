import { Router } from 'express';
import Dish from "../models/dish.js"
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';
import uploadImageMiddleware from '../middleware/uploadImage.js';

const router = Router();

router.post('/postDishes', authenticateAdmin, ...uploadImageMiddleware('image'), async (req, res) => {
  try {
    const { category, name, description, price, allergens } = req.body;

    const newDish = new Dish({
      category,
      name,
      description,
      price,
      allergens,
      image: req.imageUrl || ''
    });

    await newDish.save();
    res.status(200).json(newDish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/getDishes', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.status(200).json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para editar un plato existente

router.put('/editDish/:id', authenticateAdmin, ...uploadImageMiddleware('image'), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (req.imageUrl) {
      updates.image = req.imageUrl;
    }

    const updatedDish = await Dish.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedDish) {
      return res.status(404).json({ message: 'Plato no encontrado' });
    }

    res.status(200).json({ message: 'Plato actualizado con éxito', dish: updatedDish });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el plato', error: err.message });
  }
});

// Eliminar un plato
router.delete('/deleteDish/:id', authenticateAdmin, async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);

    if (!dish) {
      return res.status(404).json({ message: 'Plato no encontrado.' });
    }

    res.status(200).json({ message: 'Plato eliminado correctamente.', dish });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el plato.', error });
  }
});

export default router;