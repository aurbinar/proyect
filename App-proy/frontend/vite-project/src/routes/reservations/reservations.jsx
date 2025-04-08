import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './reservations.css';

const Reservation = () => {
  const [date, setDate] = useState('');
  const [shift, setShift] = useState('');
  const [people, setPeople] = useState(1);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/reservations/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(response.data);
      } catch (error) {
        setMessage('Error al obtener las reservas.');
      }
    };

    fetchReservations();
  }, []);

  const handleReservation = async (e) => {
    e.preventDefault();
    console.log(date, shift, people, phone);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/reservations/create',
        { date, shift, people, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Reserva creada con éxito.');
      setReservations([...reservations, response.data.reservation]);
    } catch (error) {
      setMessage(error.response.data.message || 'Error al crear la reserva.');
    }
  };

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/reservations/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Reserva cancelada con éxito.');
      setReservations(reservations.filter((reservation) => reservation._id !== id));
    } catch (error) {
      setMessage('Error al cancelar la reserva.');
    }
  };

  return (
    <div className="reservation-container">
      <h2>Reservar una Mesa</h2>
      <form onSubmit={handleReservation}>
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
          <select value={shift} onChange={(e) => setShift(e.target.value)} required>
            <option value="1">12</option>
            <option value="2">13</option>
            <option value="3">14</option>
          </select>
        </label>
        <label>
          Número de personas:
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            min="1"
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
      <h3>Mis Reservas</h3>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation._id}>
            {reservation.date} - {reservation.shift} - {reservation.people} personas - {reservation.status}
            <button onClick={() => handleCancel(reservation._id)}>Cancelar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reservation;