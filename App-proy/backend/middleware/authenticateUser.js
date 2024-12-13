import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Obtén el token del header
  
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado, se requiere un token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado, se requiere el rol de admin' });
    }
    req.user = decoded; // Almacena la información del usuario en la request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido', error });
  }
};
