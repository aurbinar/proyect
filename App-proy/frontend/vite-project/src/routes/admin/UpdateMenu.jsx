import { useState, useEffect } from 'react';
import axios from 'axios';
import "./Admin.css";

const UpdateMenu = () => {
  const [menu, setMenu] = useState(null);
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!date) return;
    axios.get(`http://localhost:5000/api/getDayMenu`, {
      params: { date },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setMenu(res.data);
        setMessage('');
      })
      .catch(error => {
        setMenu(null);
        if (error.response && error.response.data && error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('No se pudo cargar el menú para la fecha seleccionada');
        }
      });
  }, [date, token]);

  const handleChange = (section, index, value) => {
    const updated = [...menu[section]];
    updated[index] = value;
    setMenu(prev => ({ ...prev, [section]: updated }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put('http://localhost:5000/api/updateMenu', { ...menu, date }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => alert('Menú actualizado correctamente.'));
  };

  return (
    <div className="menu-container">
      <h2>Editar menú del día</h2>

      <label>Selecciona la fecha:</label>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      {menu ? (
        <form onSubmit={handleSubmit} className="menu-form">
          {['primeros', 'segundos', 'especial', 'postres'].map(section => (
            <div key={section}>
              <h3>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
              {menu[section].map((item, i) => (
                <input
                  key={i}
                  type="text"
                  value={item}
                  onChange={e => handleChange(section, i, e.target.value)}
                />
              ))}
            </div>
          ))}

          <label>Precio:</label>
          <input
            type="text"
            value={menu.precio || ''}
            onChange={e => setMenu(prev => ({ ...prev, precio: e.target.value }))}
          />

          <button type="submit">Guardar cambios</button>
        </form>
      ) : (
        date && <p>No hay menú para el día seleccionado.</p>
      )}
    </div>
  );
};

export default UpdateMenu;
