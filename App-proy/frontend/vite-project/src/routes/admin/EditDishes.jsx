import React, { useEffect, useState } from 'react';
import './admin.css';
import axios from 'axios';
import { Pencil, Trash2, Check, X } from 'lucide-react';

const EditDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [editingDishId, setEditingDishId] = useState(null);
  const [editedDish, setEditedDish] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDishName, setConfirmDishName] = useState('');
  const [newImage, setNewImage] = useState(null);

  const token = localStorage.getItem('token');

  const categories = [
    'Entrante', 'Arroces y Fideua', 'Carnes', 'Hamburgesas',
    'Tostas', 'Ensaladas', 'Pescados y Mariscos', 'Postres'
  ];

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/getDishes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setDishes(res.data))
      .catch(err => console.error('Error al cargar los platos', err));
  }, [token]);

  const handleEditClick = dish => {
    setEditingDishId(dish._id);
    setEditedDish({ ...dish });
    setNewImage(null);
  };

  const handleCancel = () => {
    setEditingDishId(null);
    setEditedDish({});
    setNewImage(null);
  };

  const handleUpdate = async (id) => {
    const form = new FormData();
    form.append('name', editedDish.name);
    form.append('description', editedDish.description);
    form.append('price', editedDish.price);
    form.append('allergens', editedDish.allergens);

    if (newImage) {
      form.append('image', newImage);
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/editDish/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDishes(prev =>
        prev.map(d => (d._id === id ? res.data.dish : d))
      );
      handleCancel();
    } catch (err) {
      console.error('Error al actualizar el plato', err);
    }
  };


  const groupDishesByCategory = (dishes) => {
    return dishes.reduce((groups, dish) => {
      const category = dish.category || 'Sin categoría';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(dish);
      return groups;
    }, {});
  };

  const groupedDishes = groupDishesByCategory(dishes);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/deleteDish/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDishes(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      console.error('Error al eliminar el plato', err);
    }
  };

  return (
    <div className="admin-container">
      <h2>Editar Platos</h2>

      {Object.entries(groupedDishes).map(([category, dishesInCategory]) => (
        <div key={category} className="dish-category-group">
          <h3>{category}</h3>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dishesInCategory.map(dish => (
                <React.Fragment key={dish._id}>
                  <tr>
                    <td>{dish.name}</td>
                    <td>
                      <button onClick={() => handleEditClick(dish)}><Pencil size={16} /></button>
                      <button
                        onClick={() => {
                          setConfirmDeleteId(dish._id);
                          setConfirmDishName(dish.name);
                        }}
                        className="danger">
                        <Trash2 size={16} />
                      </button>
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

                          {editedDish.image && (
                            <div>
                              <p>Imagen actual:</p>
                              <img src={editedDish.image} alt="Plato actual" style={{ maxWidth: '150px', marginBottom: '10px' }} />
                            </div>
                          )}

                          <label>Cambiar imagen:
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => setNewImage(e.target.files[0])}
                            />
                          </label>

                          <div className="edit-actions">
                            <button onClick={() => handleUpdate(dish._id)}><Check color="green" size={18} /></button>
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
      ))}
      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>¿Eliminar plato?</h3>
            <p>¿Estás seguro de que deseas eliminar <strong>{confirmDishName}</strong>?</p>
            <div className="modal-actions">
              <button
                className="confirm"
                onClick={() => {
                  handleDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                  setConfirmDishName('');
                }}
              >
                Confirmar
              </button>
              <button
                className="cancel"
                onClick={() => {
                  setConfirmDeleteId(null);
                  setConfirmDishName('');
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDishes;
