import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const AdminRoute = ({ children }) => {

  const { user, loading } = useAuth();

  if (loading) {
      return <div>Cargando...</div>;
  }

  return user?.role === 'admin' ? children : <Navigate to="/" />;
  
};

export default AdminRoute;