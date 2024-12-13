// deno-lint-ignore-file
import express from 'express';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import dishesRouter from './routes/dishes.js';
import menuRoutes from './routes/menu.js';
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Conectar a MongoDB
connect(process.env.MONGODB_URI).then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

// Rutas
app.use('/', dishesRouter);
app.use('/', menuRoutes);
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes); 


// Escuchar en el puerto definido en .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
