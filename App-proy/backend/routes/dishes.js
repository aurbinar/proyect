import { Router } from 'express';
import Dish from "../models/dish.js"
const router = Router();

export const postDishes = router.post('/dishes', async (req, res) => {
    const { category, name, description, price, allergens, image } = req.body;

  try {
        const newDish = new Dish(req.body);
        await newDish.save();
        res.status(200).json(newDish);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });

export const getDishes = router.get('/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.status(200).json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
