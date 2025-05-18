import { useEffect, useState } from 'react';
import './Admin.css';

const AdminUsers = () => {

  const [users, setUsers] = useState([]);

	const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/protected/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, [token]);

  const toggleBlock = (id, currentStatus) => {
    fetch(`http://localhost:5000/protected/admin/blockUser/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ block: !currentStatus }),
    })
      .then(res => res.json())
      .then(() => {
        setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !currentStatus } : u));
      });
  };

  const deleteUser = id => {
    fetch(`http://localhost:5000/protected/admin/deleteUser/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(() => setUsers(prev => prev.filter(u => u._id !== id)));
  };

  return (
    <div className="admin-container">
      <h2>Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.isBlocked ? 'Bloqueado' : 'Activo'}</td>
              <td>
                <button onClick={() => toggleBlock(user._id, user.isBlocked)}>
                  {user.isBlocked ? 'Desbloquear' : 'Bloquear'}
                </button>
                <button onClick={() => deleteUser(user._id)} className="danger">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
