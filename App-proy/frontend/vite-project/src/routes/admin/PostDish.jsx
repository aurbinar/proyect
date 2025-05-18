import React, { useState } from 'react';
import axios from 'axios';
import './admin.css';

const AddDish = () => {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    description: '',
    price: '',
    allergens: '',
    image: '',
  });

  const [message, setMessage] = useState('');

  const categories = ['Entrante', 'Principal', 'Postre', 'Bebida', 'Especial'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/postDishes', formData, { withCredentials: true });
      setMessage('Plato añadido con éxito');
      setFormData({
        category: '',
        name: '',
        description: '',
        price: '',
        allergens: '',
        image: '',
      });
    } catch (err) {
      setMessage('Error al añadir el plato');
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Añadir Nuevo Plato</h2>
      <form className="dish-form" onSubmit={handleSubmit}>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          placeholder="Nombre del plato"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="allergens"
          placeholder="Alérgenos"
          value={formData.allergens}
          onChange={handleChange}
        />

        <input
          type="text"
          name="image"
          placeholder="URL de la imagen"
          value={formData.image}
          onChange={handleChange}
        />

        <button type="submit">Añadir Plato</button>
      </form>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default AddDish;
