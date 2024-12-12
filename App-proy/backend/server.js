import express from 'express';
import { connect } from 'mongoose';
// const cors = require('cors');
import dotenv from 'dotenv';
import {postDishes, getDishes} from './routes/dishes.js';
import { updateMenu, getMenu } from './routes/menu.js';
dotenv.config();

const app = express();

// Middleware
// app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connect(process.env.MONGODB_URI).then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

// Rutas
app.use('/', getDishes);
app.use('/', postDishes);
app.use('/', getMenu);
app.use('/', updateMenu);

// Escuchar en el puerto definido en .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
