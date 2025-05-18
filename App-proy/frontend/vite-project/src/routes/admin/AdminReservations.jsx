import { useEffect, useState } from 'react';
import './Admin.css';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/protected/admin/reservations', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setReservations(data));
  }, [token]);

  const updateStatus = (id, status) => {
    fetch(`http://localhost:5000/protected/admin/reservations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then(res => res.json())
      .then(data => {
        setReservations(prev =>
          prev.map(r => (r._id === id ? { ...r, status: data.reservation.status } : r))
        );
      });
  };

  const deleteReservation = id => {
    fetch(`http://localhost:5000/protected/admin/reservations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => setReservations(prev => prev.filter(r => r._id !== id)));
  };

  const filteredReservations = reservations
    .filter(res => {
      const matchesDate = filterDate
        ? new Date(res.date).toISOString().slice(0, 10) === filterDate
        : true;
      const matchesStatus = filterStatus ? res.status === filterStatus : true;
      return matchesDate && matchesStatus;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const renderUserInfo = (res) => {
    if (res.user) {
      return `${res.user.name} (${res.user.email})`;
    } else {
      return `${res.name || 'Sin nombre'} (${res.email || 'Sin email'})`;
    }
  };

  const renderPhone = (res) => res.user?.phone || res.phone || '—';

  return (
    <div className="admin-container">
      <h2>Reservas</h2>

      <div className="filters">
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="" hidden>Status</option>
          <option value="">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Teléfono</th>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Personas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map(res => (
              <tr key={res._id}>
                <td>{renderUserInfo(res)}</td>
                <td>{renderPhone(res)}</td>
                <td>{new Date(res.date).toLocaleDateString()}</td>
                <td>{res.shift}</td>
                <td>{res.people}</td>
                <td className={`status-${res.status}`}>{res.status}</td>
                <td className="acciones">
                  {(res.status === 'pending') && (
                    <button onClick={() => updateStatus(res._id, 'confirmed')}>Confirmar</button>
                  )}
                  {(res.status === 'pending' || res.status === 'confirmed') && (
                    <button onClick={() => updateStatus(res._id, 'cancelled')}>Cancelar</button>
                  )}
                  <button onClick={() => deleteReservation(res._id)} className="danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservations;