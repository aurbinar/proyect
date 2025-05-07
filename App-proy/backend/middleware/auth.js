import jwt from 'jsonwebtoken';
import User from '../models/usuario.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Obtener el token de `Authorization: Bearer <TOKEN>`

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Cargar usuario del token
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido.' });
  }
};


export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  const token = authHeader.split(' ')[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
  } catch (err) {
    console.log("Token inválido o expirado");
    // No hacemos res.status aquí, solo seguimos
  }

  next(); // ← ¡esto es obligatorio!
};

