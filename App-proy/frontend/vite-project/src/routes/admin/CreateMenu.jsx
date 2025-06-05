import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import './Admin.css';

const CreateMenu = () => {
  const [menu, setMenu] = useState({
    primeros: ['', '', ''],
    segundos: ['', '', ''],
    especial: ['', ''],
    postres: ['Café o infusión', 'Fruta de temporada', 'Tarta del Dia'],
    precio: '13.9',
  });

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { token } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (section, index, value) => {
    const updated = [...menu[section]];
    updated[index] = value;
    setMenu(prev => ({ ...prev, [section]: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_URL}/api/createMenu`,
        { ...menu, date: date },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data && data._id) {
        alert('Menú creado correctamente.');
      } else {
        alert('Error al crear el menú.');
      }
    } catch {
      alert('Error en la solicitud.');
    }
  };

  return (
    <div className="admin-container">
      <h2>Crear menú del día</h2>
      <form onSubmit={handleSubmit} className="menu-form">
        <label>Fecha del menú:</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        {['primeros', 'segundos', 'especial', 'postres'].map(section => (
          <div key={section}>
            <h3>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
            {menu[section].map((item, i) => (
              <input
                key={i}
                type="text"
                value={item}
                placeholder={`${section} ${i + 1}`}
                onChange={e => handleChange(section, i, e.target.value)}
              />
            ))}
          </div>
        ))}

        <label>Precio:</label>
        <input
          type="text"
          value={menu.precio}
          onChange={e => setMenu(prev => ({ ...prev, precio: e.target.value }))}
        />

        <button type="submit">Crear menú</button>
      </form>
    </div>
  );
};

export default CreateMenu;
