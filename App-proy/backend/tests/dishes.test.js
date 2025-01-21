import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../server.js'; // Importa tu servidor Express
import Dish from '../models/dish.js';

let mongoServer;

beforeAll(async () => {
  // Configurar MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Cerrar conexiones después de las pruebas
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Limpiar la base de datos después de cada prueba
  await Dish.deleteMany();
});

describe('Pruebas para /dishes', () => {
  it('POST /api/postDishes debería crear un nuevo plato', async () => {
    const newDish = {
      name: 'Pasta',
      price: 10,
      description: 'Deliciosa pasta',
      allergens: ['gluten'],
      category: "pasta",
      image: "askdvjsdakbsl.png"
    };

    const response = await request(app).post('/api/postDishes').send(newDish);

    expect(response.status).toBe(200); // Asegúrate de que el estado sea 201 (Created)
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe('Pasta');
  });

  it('GET /api/getDishes debería devolver una lista de platos', async () => {
    const dish1 = await Dish.create({
      name: 'Pizza Margarita',
      price: 12,
      description: 'Pizza con tomate, albahaca y mozzarella',
      allergens: [],
      category: 'Plato Principal',
      image: "kbnasnbfaklfba.png"
    });

    const response = await request(app).get('/api/getDishes');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].name).toBe(dish1.name);
  });
});