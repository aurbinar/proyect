import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css';

const AddDish = () => {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    description: '',
    price: '',
    allergens: '',
    image: null,
  });

  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const API_URL = import.meta.env.VITE_API_URL;


  const categories = [
    'Entrante', 'Arroces y Fideua', 'Carnes', 'Hamburgesas',
    'Tostas', 'Ensaladas', 'Pescados y Mariscos', 'Postres'
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('category', formData.category);
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('allergens', formData.allergens);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const response = await axios.post(`${API_URL}/api/postDishes`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Plato añadido con éxito');
      setFormData({
        category: '',
        name: '',
        description: '',
        price: '',
        allergens: '',
        image: null,
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || 'Error al añadir el plato'
      );
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

        <input type="text" name="name" placeholder="Nombre del plato" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} required />
        <input type="text" name="price" placeholder="Precio" value={formData.price} onChange={handleChange} required />
        <input type="text" name="allergens" placeholder="Alérgenos" value={formData.allergens} onChange={handleChange} />
        <input type="file" name="image" accept="image/*" onChange={handleChange} />

        <button type="submit">Añadir Plato</button>
      </form>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default AddDish;
