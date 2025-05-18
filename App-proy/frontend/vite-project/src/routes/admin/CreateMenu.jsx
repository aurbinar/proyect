import { useState } from 'react';
import './admin.css';

const CreateMenu = () => {
  const [menu, setMenu] = useState({
    primeros: ['', '', ''],
    segundos: ['', '', ''],
    especial: ['', ''],
    postres: ['Café o infusión', 'Fruta de temporada', 'Tarta del Dia'],
    precio: '13.9',
  });

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);


  const token = localStorage.getItem('token');

  const handleChange = (section, index, value) => {
    const updated = [...menu[section]];
    updated[index] = value;
    setMenu(prev => ({ ...prev, [section]: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/createMenu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...menu, date: date }),
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          alert('Menú creado correctamente.');
        } else {
          alert('Error al crear el menú.');
        }
      })
      .catch(() => alert('Error en la solicitud.'));
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
