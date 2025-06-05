import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { login, logout, isLoggedIn, user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });

      login(response.data.token);

      setMessage(`Bienvenido ${response.data.name || response.data.user?.name || ''}`);
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const handleLogout = () => {
    logout();
    setMessage('Sesión cerrada');
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <div>
          <h2>Bienvenido {user?.name}</h2>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Iniciar Sesión</button>
          <div className="login-links">
            <Link to="/register">¿No tienes usuario? Registrate</Link>
          </div>
          <div className="login-links">
            <Link to="/recover">¿Olvidaste tu contraseña?</Link>
          </div>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;