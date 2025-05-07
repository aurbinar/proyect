import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const { login, logout } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      login(response.data.token); 
      setMessage('Inicio de sesión exitoso');
    } catch (error) {
      setMessage(error.response.data.message || 'Error al iniciar sesión');
    }
  };

  const handleLogout = () => {
    logout();
    setMessage('Sesión cerrada');
  };

  return (
    <div className="login-container">
      {token ? (
        <div>
          <h2>Bienvenido</h2>
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
            <Link to="/recover">¿Olvidaste tu contraseña?</Link>
          </div>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;