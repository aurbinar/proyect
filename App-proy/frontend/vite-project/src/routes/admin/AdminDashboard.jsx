import { useEffect, useState } from 'react';
import './Admin.css';

const AdminDashboard = () => {
  
  const [stats, setStats] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/protected/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setStats(data))
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
    </div>
  );
};

export default AdminDashboard;
