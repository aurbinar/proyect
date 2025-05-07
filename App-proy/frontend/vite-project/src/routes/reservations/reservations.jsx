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
      const data = { date, shift, people, phone };
      

      if (!isLoggedIn) {
        data.name = name;
        data.email = email;
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
        setReservations([...reservations, response.data.reservation, user.name, user.email]);
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
    <div className="reservation-container">
      <h2>Reservar una Mesa</h2>
      <form onSubmit={handleReservation}>
      {!isLoggedIn && (
          <>
            <label>
              Nombre:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </>
        )}
        <label>
          Fecha:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          Turno:
          <select  value={shift} onChange={(e) => setShift(e.target.value)} required>
          <option value="" hidden>Selecciona un turno</option>
            <option value="1">12:00</option>
            <option value="2">13:00</option>
            <option value="3">14:00</option>
          </select>
        </label>
        <label>
          Número de personas:
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            min="2"
            required
          />
        </label>
        <label>
          Teléfono:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            {reservations.map((reservation) => (
              <li key={reservation._id}>
                {new Date(reservation.date).toLocaleDateString()} - Turno {reservation.shift} - {reservation.people} personas - {reservation.status}
                <button onClick={() => handleCancel(reservation._id)}>Cancelar</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Reservation;
