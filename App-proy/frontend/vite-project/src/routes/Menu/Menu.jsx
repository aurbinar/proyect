import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Menu.css';

const Menu = () => {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getMenu');
        setMenu(response.data);
      } catch (error) {
        setError('Error al obtener el menú del día');
      }
    };

    fetchMenu();
  }, []);

  if (error) {
    return <div className="menu-container"><p>{error}</p></div>;
  }

  if (!menu) {
    return <div className="menu-container"><p>Cargando menú...</p></div>;
  }

  return (
    <div className="menu-container">
      <h2>Menú del Día</h2>
      <div className="menu-section">
        <h3>Primeros</h3>
        <ul>
          {menu.primeros.map((plato, index) => (
            <li key={index}>{plato}</li>
          ))}
        </ul>
      </div>
      <div className="menu-section">
        <h3>Segundos</h3>
        <ul>
          {menu.segundos.map((plato, index) => (
            <li key={index}>{plato}</li>
          ))}
        </ul>
      </div>
      <div className="menu-section">
        <h3>Especial</h3>
        <h4 className="especial-descripcion">Primero a elegir del menú del día y dos segundos especiales seleccionables.</h4>
        <ul>
          {menu.especial.map((plato, index) => (
            <li key={index}>{plato}</li>
          ))}
        </ul>
      </div>
      <div className="menu-section">
        <h3>Postres</h3>
        <ul>
          {menu.postres.map((postre, index) => (
            <li key={index}>{postre}</li>
          ))}
        </ul>
      </div>
      <div className="menu-section">
        <h3>Precio</h3><br/>
        <p>{menu.precio} €</p>
      </div>
    </div>
  );
};

export default Menu;