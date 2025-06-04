import React, { useState } from 'react';
import axios from 'axios';
import './recoverPassword.css';

const RecoverPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRecover = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/recover', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message || 'Error al enviar el correo de recuperación.');
    }
  };

  return (
    <div className="recover-container">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleRecover}>
        <label>
          Correo electrónico:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RecoverPassword;