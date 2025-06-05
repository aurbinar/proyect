import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import './Admin.css';

const AdminUsers = () => {

  const [users, setUsers] = useState([]);
  const { token } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/protected/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setUsers(res.data));
  }, [token]);

  const toggleBlock = (id, currentStatus) => {
    axios.put(
      `${API_URL}/protected/admin/blockUser/${id}`,
      { block: !currentStatus },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(() => {
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !currentStatus } : u));
    });
  };

  const deleteUser = id => {
    axios.delete(`${API_URL}/protected/admin/deleteUser/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => setUsers(prev => prev.filter(u => u._id !== id)));
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
