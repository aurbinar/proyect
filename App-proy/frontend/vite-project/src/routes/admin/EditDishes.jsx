import React, { useEffect, useState } from 'react';
import './admin.css';
import { Pencil, Trash2, Check, X } from 'lucide-react';

const EditDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [editingDishId, setEditingDishId] = useState(null);
  const [editedDish, setEditedDish] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/getDishes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setDishes(data));
  }, [token]);

  const handleEditClick = dish => {
    setEditingDishId(dish._id);
    setEditedDish({ ...dish });
  };

  const handleCancel = () => {
    setEditingDishId(null);
    setEditedDish({});
  };

  const handleUpdate = (id) => {
    fetch(`http://localhost:5000/api/editDish/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedDish),
    })
      .then(res => res.json())
      .then(data => {
        setDishes(prev => prev.map(d => d._id === id ? data.dish : d));
        setEditingDishId(null);
        setEditedDish({});
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/deleteDish/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => setDishes(prev => prev.filter(d => d._id !== id)));
  };

   return (
    <div className="admin-container">
      <h2>Editar Platos</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map(dish => (
            <React.Fragment key={dish._id}>
              <tr>
                <td>{dish.name}</td>
                <td>
                  <button onClick={() => handleEditClick(dish)}><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(dish._id)} className="danger"><Trash2 size={16} /></button>
                </td>
              </tr>
              {editingDishId === dish._id && (
                <tr>
                  <td colSpan="2">
                    <div className="edit-form">
                      <label>Nombre:
                        <input
                          type="text"
                          value={editedDish.name || ''}
                          onChange={e => setEditedDish({ ...editedDish, name: e.target.value })}
                        />
                      </label>
                      <label>Descripción:
                        <input
                          type="text"
                          value={editedDish.description || ''}
                          onChange={e => setEditedDish({ ...editedDish, description: e.target.value })}
                        />
                      </label>
                      <label>Precio:
                        <input
                          type="text"
                          value={editedDish.price || ''}
                          onChange={e => setEditedDish({ ...editedDish, price: e.target.value })}
                        />
                      </label>
                      <label>Alergenos:
                        <input
                          type="text"
                          value={editedDish.allergens || ''}
                          onChange={e => setEditedDish({ ...editedDish, allergens: e.target.value })}
                        />
                      </label>
                      <div className="edit-actions">
                        <button onClick={handleUpdate}><Check color="green" size={18} /></button>
                        <button onClick={handleCancel}><X color="red" size={18} /></button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditDishes;