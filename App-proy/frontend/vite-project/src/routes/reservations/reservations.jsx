import React, { useState, useEffect } from 'react';
import { useAuth  } from '../../context/authContext';
import axios from 'axios';
import './reservations.css';

const Reservation = () => {
  const [date, setDate] = useState('');
  const [shift, setShift] = useState('');
  const [people, setPeople] = useState(2);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [reservations, setReservations] = useState([]);
  const { user } = useAuth();

  const token = localStorage.getItem('token');
  const isLoggedIn = (token);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reservations/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(response.data);
      } catch (error) {
        setMessage('Error al obtener las reservas.');
      }
    };
    fetchReservations();
  }, [token]);

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const data = { date, shift, people };
      

      if (!isLoggedIn) {
        data.name = name;
        data.email = email;
        data.phone = phone;
      }
      console.log(data)
      const response = await axios.post(
        'http://localhost:5000/api/reservations/create',
        data,
        isLoggedIn
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined
      );
      
      setMessage('Reserva creada con éxito.');
      if (isLoggedIn) {
        setReservations([...reservations, response.data.reservation]);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al crear la reserva.');
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reservations/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Reserva cancelada con éxito.');
      setReservations(reservations.filter((r) => r._id !== id));
    } catch (error) {
      setMessage('Error al cancelar la reserva.');
    }
  };

  return (
    <div className="reservation-container" style={{ height: '100vh', width: '100vw' }}>
      <div className="form-container">
        <h2>Reservar una Mesa</h2>
        <form onSubmit={handleReservation}>
        {!isLoggedIn && (
            <>
              <label>
                <input
                  type="text"
                  value={name}
                  placeholder='Nombre'
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label>
                <input
                  type="email"
                  value={email}
                  placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                <input
                  type="tel"
                  value={phone}
                  placeholder='Telefono'
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </label>
            </>
          )}
          <label>
              <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <label>
              <select  value={shift} onChange={(e) => setShift(e.target.value)} required>
            <option value="" hidden>Selecciona un turno</option>
              <option value="1">13:00</option>
              <option value="2">14:00</option>
              <option value="3">15:00</option>
            </select>
          </label>
          <label>
            <input
              type="number"
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              min="2"
              max="8"
              required
            />
          </label>
          <button type="submit">Reservar</button>
        </form>

        {message && <p>{message}</p>}
         
      {isLoggedIn && (
        <>
          <h3>Mis Reservas</h3>
          <ul>
            {reservations
            .filter((reservation)=> reservation.status == "confirmed")
            .map((reservation) => (
              <li key={reservation._id}>
                {new Date(reservation.date).toLocaleDateString()} - Turno {reservation.shift} - {reservation.people} personas - {reservation.status}
                <button onClick={() => handleCancel(reservation._id)}>Cancelar</button>
              </li>
            ))}
          </ul>
        </>
      )}
      </div>   
      <div className="map-container">
        <h3>¿Dónde estamos?</h3>
        <iframe
          title="Ubicación del Restaurante"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6077.014829644837!2d-3.606967823470259!3d40.39760865680221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42256e23fbcd49%3A0xf1835ff8d8b458f!2sRestaurante%20Carb%C3%B3nico%20by%20La%20Birra%20es%20Bella!5e0!3m2!1ses!2ses!4v1747154867086!5m2!1ses!2ses" // <- Reemplaza esto con el link real de tu ubicación
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Reservation;
