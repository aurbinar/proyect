import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children = null }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true); 

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
          setToken('');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    axios
      .get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${newToken}` },
      })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Login error:', err);
        setUser(null);
        setToken('');
      });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken('');
  };

  const editProfile = async (updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/profile/edit`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user); // Actualizar el usuario en el estado
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { success: false, message: error.response?.data?.message || 'Error desconocido' };
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isLoggedIn: !!user, editProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
