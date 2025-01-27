import { Router } from 'express';
import Menu from '../models/menu.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

router.put('/updateMenu', authenticateAdmin, async (req, res) => {
  const { primeros, segundos, especial, postres, precio } = req.body;

  try {
    const today = new Date().toISOString().split('T')[0]; // Fecha actual sin hora

    // Encuentra el menú del día basado en la fecha y actualiza sus datos
    const menu = await Menu.findOneAndUpdate(
      { date: today }, // Busca el menú por la fecha actual
      { primeros, segundos, especial, postres, precio, date: today }, // Actualiza los valores
      { new: true, upsert: true } // Crea un nuevo documento si no existe
    );

    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el menú del día', error });
  }
});


//Obtener el menú del día
router.get('/getMenu', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const menu = await Menu.findOne({ date: today });
    if (!menu) {
      return res.status(404).json({ message: 'No hay menú para hoy' });
    }
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el menú del día', error });
  }
});

export default router;