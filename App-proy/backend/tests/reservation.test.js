import request from 'supertest';
import app from '../server.js'; // Asegúrate de importar tu aplicación
import Reservation from '../models/reservation.js';
import User from '../models/usuario.js';

let token;

beforeAll(async () => {
  // Crear un usuario de prueba y obtener el token de autenticación
  const user = await User.create({
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
    role: 'customer',
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'testuser@example.com',
    password: 'password123',
  });

  token = res.body.token;
});

afterAll(async () => {
  // Limpia la base de datos después de las pruebas
  await User.deleteMany({});
  await Reservation.deleteMany({});
});

describe('Reservation API Tests', () => {
  test('Should create a new reservation', async () => {
    const res = await request(app)
    
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2025-02-01',
        shift: '1',
        people: 4,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('date', '2025-02-01');
  });

  test('Should get reservations for the logged-in user', async () => {
    const res = await request(app)
      .get('/api/reservations/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Should not create a reservation with invalid data', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2025-02-01',
        shift: '3', // Turno inválido
        people: 4,
      });

    expect(res.statusCode).toBe(400);
  });

  test('Should update a reservation', async () => {
    const reservation = await Reservation.create({
      date: '2025-02-01',
      shift: '1',
      people: 4,
      user: token.id,
    });

    const res = await request(app)
      .put(`/api/reservations/${reservation._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2025-02-02',
        shift: '2',
        people: 2,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('shift', '2');
  });

  test('Should delete a reservation', async () => {
    const reservation = await Reservation.create({
      date: '2025-02-01',
      shift: '1',
      people: 4,
      user: token.id,
    });

    const res = await request(app)
      .delete(`/api/reservations/${reservation._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Reserva cancelada exitosamente');
  });
});
