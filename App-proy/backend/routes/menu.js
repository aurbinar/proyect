import { Router } from 'express';
import Menu from '../models/menu.js';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';

const router = Router();

router.post('/createMenu', authenticateAdmin, async (req, res) => {
  const {date, primeros, segundos, especial, postres, precio } = req.body;

  const menuDate = new Date(date).toISOString().split('T')[0];

  try {
    const existing = await Menu.findOne({ date: menuDate });
      if (existing) {
      return res.status(400).json({ message: 'Ya existe un menú para esa fecha' });
    }

    const newMenu = new Menu({
      date: menuDate,
      primeros,
      segundos,
      especial,
      postres,
      precio,
    });

    await newMenu.save();

    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el menú', error });
  }
});

router.put('/updateMenu', authenticateAdmin, async (req, res) => {
  const { date, primeros, segundos, especial, postres, precio } = req.body;

  const menuDate = new Date(date).toISOString().split('T')[0];

  try {
    const updatedMenu = await Menu.findOneAndUpdate(
      { date: menuDate },
      { primeros, segundos, especial, postres, precio },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: 'No hay menú creado para esa fecha.' });
    }

    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el menú', error });
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

router.get('/getDayMenu', authenticateAdmin, async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'La fecha es obligatoria' });
  }

  const menuDate = new Date(date).toISOString().split('T')[0];

  try {
    const menu = await Menu.findOne({ date: menuDate });
    if (!menu) {
      return res.status(404).json({ message: `No hay menú para la fecha ${menuDate}` });
    }
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el menú del día', error });
  }
});

export default router;