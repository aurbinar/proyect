// src/pages/DishList.jsx
import React, { useState, useEffect } from 'react';
import { getDishes } from '../api';
import './DishList.css';

function DishList() {
    const [dishes, setDishes] = useState([]);
    const [filteredDishes, setFilteredDishes] = useState([]);
    const [category, setCategory] = useState('');
  
    useEffect(() => {
      fetchDishes();
    }, []);
  
    const fetchDishes = async () => {
      const data = await getDishes();
      setDishes(data);
      setFilteredDishes(data);
    };
  
    const handleCategoryChange = (e) => {
      const selectedCategory = e.target.value;
      setCategory(selectedCategory);
      if (selectedCategory === '') {
        setFilteredDishes(dishes);
      } else {
        setFilteredDishes(dishes.filter(dish => dish.category === selectedCategory));
      }
    };
  
    return (
      <div className="dish-list-container">
        <h1>Lista de Platos</h1>
        <div className="filter-container">
          <label htmlFor="category">Filtrar por Categoría:</label>
          <select id="category" value={category} onChange={handleCategoryChange}>
            <option value="">Todas</option>
            <option value="Entrantes">Entrantes</option>
            <option value="Principal">Principal</option>
            <option value="Postre">Postre</option>
            {/* Añade más opciones según tus categorías */}
          </select>
        </div>
        <ul className="dish-list">
          {filteredDishes.map((dish) => (
            <li key={dish._id} className="dish-item">
              <h2>{dish.name}</h2>
              <p>{dish.description}</p>
              <p>Precio: {dish.price}</p>
              <p>Categoría: {dish.category}</p>
              <p>Descripcion: {dish.description}</p>
              <p>Alérgenos: {dish.allergens}</p>
              <img src={dish.image} alt={dish.name} className="dish-image" />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default DishList;