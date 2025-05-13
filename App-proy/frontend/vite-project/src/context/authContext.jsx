import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Crear el contexto
const AuthContext = createContext();

// Hook para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);

// Proveedor de contexto
export const AuthProvider = ({ children = null }) => {
  const [user, setUser] = useState(null); // datos del usuario
  const [loading, setLoading] = useState(true); // saber si está cargando

  // Comprobar si hay token al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:5000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    axios
      .get('http://localhost:5000/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Login error:', err);
        setUser(null);
      });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const editProfile = async (updatedData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put('http://localhost:5000/profile/edit', updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user); // Actualizar el usuario en el estado
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { success: false, message: error.response?.data?.message || 'Error desconocido' };
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isLoggedIn: !!user, editProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
