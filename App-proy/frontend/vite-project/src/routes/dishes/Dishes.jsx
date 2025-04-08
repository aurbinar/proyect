// src/Dishes.jsx
import React, { useState, useEffect } from 'react';
import { getDishes, postDish, editDish, deleteDish } from '../api';
import "./Dishes.css";

function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({
    category: '',
    name: '',
    description: '',
    price: '',
    allergens: '',
    image: '',
  });

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    const data = await getDishes();
    setDishes(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDish({ ...newDish, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postDish(newDish);
    fetchDishes();
  };

  const handleEdit = async (id) => {
    const updates = { name: 'Nuevo Nombre' }; // Ejemplo de actualización
    await editDish(id, updates);
    fetchDishes();
  };

  const handleDelete = async (id) => {
    await deleteDish(id);
    fetchDishes();
  };

  return (
    <div className="dishes-container">
      <h1>Platos</h1>
      <form className="dishes-form" onSubmit={handleSubmit}>
        <input name="category" value={newDish.category} onChange={handleInputChange} placeholder="Categoría" />
        <input name="name" value={newDish.name} onChange={handleInputChange} placeholder="Nombre" />
        <input name="description" value={newDish.description} onChange={handleInputChange} placeholder="Descripción" />
        <input name="price" value={newDish.price} onChange={handleInputChange} placeholder="Precio" />
        <input name="allergens" value={newDish.allergens} onChange={handleInputChange} placeholder="Alérgenos" />
        <input name="image" value={newDish.image} onChange={handleInputChange} placeholder="Imagen" />
        <button type="submit">Agregar Plato</button>
      </form>
      <ul className="dishes-list">
        {dishes.map((dish) => (
          <li key={dish._id}>
            {dish.name} - {dish.price}
            <div>
              <button onClick={() => handleEdit(dish._id)}>Editar</button>
              <button onClick={() => handleDelete(dish._id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dishes;