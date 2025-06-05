import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './resetPassword.css';


const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/reset/${token}`, { password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al restablecer la contraseña.');
    }
  };

  return (
    <div className="reset-container">
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleReset}>
        <label>
          Nueva contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirmar contraseña:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Restablecer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
