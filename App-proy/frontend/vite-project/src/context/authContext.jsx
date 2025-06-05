import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children = null }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${API_URL}/auth/me`, {
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
      .get(`${API_URL}/auth/me`, {
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
      const response = await axios.put(`${API_URL}/profile/edit`, updatedData, {
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
