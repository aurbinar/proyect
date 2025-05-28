import { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [todayReservations, setTodayReservations] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:5000/protected/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, [token]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/protected/admin/reservations', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const today = new Date().toISOString().slice(0, 10);
        const filtered = res.data.filter(res => res.date.slice(0, 10) === today);
        setTodayReservations(filtered);
      })
      .catch(err => console.error(err));
  }, [token]);

  if (!stats) return <p>Cargando datos del panel...</p>;

  return (
    <div className="admin-container">
      <h2>Panel de Administrador</h2>
      <ul>
        <li>Reservas totales: {stats.totalReservations}</li>
        <li>Pendientes: {stats.pendingReservations}</li>
        <li>Confirmadas: {stats.confirmedReservations}</li>
        <li>Canceladas: {stats.cancelledReservations}</li>
        <li>Platos registrados: {stats.totalDishes}</li>
        <li>Usuarios registrados: {stats.totalUsers}</li>
      </ul>
      <div className="today-reservations">
        <h3>Reservas para Hoy</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Teléfono</th>
              <th>Turno</th>
              <th>Personas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {todayReservations.map(res => (
              <tr key={res._id}>
                <td>{res.user?.name || res.name || 'Sin nombre'}</td>
                <td>{res.user?.phone || res.phone || '—'}</td>
                <td>{res.shift}</td>
                <td>{res.people}</td>
                <td className={`status-${res.status}`}>{res.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
