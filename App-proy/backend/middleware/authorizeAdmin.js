export const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado, no tienes permisos de administrador' });
    }
    next(); // Si es admin, continúa con la solicitud
  };