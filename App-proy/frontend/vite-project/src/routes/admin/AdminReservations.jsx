import { useEffect, useState, useContext } from 'react';
import './admin.css';

const AdminReservations = () => {

  const [reservations, setReservations] = useState([]);

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
        setReservations(prev => prev.map(r => r._id === id ? { ...r, status: data.reservation.status } : r));
      });
  };

  const deleteReservation = id => {
    fetch(`http://localhost:5000/protected/admin/reservations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => setReservations(prev => prev.filter(r => r._id !== id)));
  };

  return (
    <div className="admin-container">
      <h2>Reservas</h2>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Fecha</th>
            <th>Turno</th>
            <th>Personas</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(res => (
            <tr key={res._id}>
              <td>{res.user?.name} ({res.user?.email})</td>
              <td>{new Date(res.date).toLocaleDateString()}</td>
              <td>{res.shift}</td>
              <td>{res.people}</td>
              <td>{res.status}</td>
              <td>
                <button onClick={() => updateStatus(res._id, 'confirmed')}>Confirmar</button>
                <button onClick={() => updateStatus(res._id, 'cancelled')}>Cancelar</button>
                <button onClick={() => deleteReservation(res._id)} className="danger">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReservations;