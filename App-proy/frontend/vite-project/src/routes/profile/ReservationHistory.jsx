import { useEffect, useState } from 'react';
import axios from 'axios';
import './ReservationHistory.css'; 

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchReservations = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/reservations/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(response.data);
      } catch (error) {
        setMessage('Error al obtener el historial de reservas.');
      }
    };

    fetchReservations();
  }, [token]);

  const today = new Date();

  const activeReservations = reservations.filter(
    (r) => r.status === 'confirmed' && new Date(r.date) >= today
  );

  const pastReservations = reservations.filter(
    (r) => r.status !== 'confirmed' || new Date(r.date) < today
  );

  return (
    <div className="history-container">
      <h2>Historial de Reservas</h2>

      {message && <p>{message}</p>}

        <h3>Reservas Activas</h3>
        {activeReservations.length === 0 ? (
          <p>No tienes reservas activas.</p>
        ) : (
          <ul className="history-list">
            {activeReservations.map((r) => (
              <li key={r._id} className="history-card active">
                <div className="active-badge">Activa</div>
                <strong>{new Date(r.date).toLocaleDateString()}</strong> – Turno {r.shift} – {r.people} personas
              </li>
            ))}
          </ul>
        )}

        <h3>Historial</h3>
        {pastReservations.length === 0 ? (
          <p>No hay reservas pasadas.</p>
        ) : (
          <ul className="history-list">
            {pastReservations.map((r) => (
              <li key={r._id} className="history-card">
                <strong>{new Date(r.date).toLocaleDateString()}</strong> – Turno {r.shift} – {r.people} personas – Estado: {r.status}
              </li>
            ))}
          </ul>
        )}
    </div>
  );
};

export default ReservationHistory;
