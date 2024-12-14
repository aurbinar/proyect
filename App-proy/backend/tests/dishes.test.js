import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import Dish from '../models/dish.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Dish.deleteMany();
});

describe('Pruebas para /dishes', () => {
  it('POST /postDishes debería crear un nuevo plato', async () => {
    const newDish = {
      category: 'Entrantes',
      name: 'Ensalada César',
      description: 'Lechuga fresca con aderezo César',
      price: 8.99,
      allergens: ['lactosa'],
      image: 'https://example.com/ensalada-cesar.jpg',
    };

    const response = await request(app).post('/postDishes').send(newDish);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(newDish.name);
    expect(response.body.category).toBe(newDish.category);
    expect(response.body.price).toBe(newDish.price);
    expect(response.body.allergens).toEqual(expect.arrayContaining(newDish.allergens));
    expect(response.body.image).toBe(newDish.image);
  });

  it('GET /getDishes debería devolver una lista de platos', async () => {
    const dish1 = await Dish.create({
      category: 'Plato Principal',
      name: 'Pizza Margarita',
      description: 'Pizza con tomate, albahaca y mozzarella',
      price: 12.99,
      allergens: ['gluten', 'lactosa'],
      image: 'https://example.com/pizza-margarita.jpg',
    });

    const dish2 = await Dish.create({
      category: 'Postres',
      name: 'Helado de Vainilla',
      description: 'Helado cremoso de vainilla',
      price: 5.99,
      allergens: ['lactosa'],
      image: 'https://example.com/helado-vainilla.jpg',
    });

    const response = await request(app).get('/getDishes');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);

    const dishNames = response.body.map((dish) => dish.name);
    expect(dishNames).toContain('Pizza Margarita');
    expect(dishNames).toContain('Helado de Vainilla');
  });
});
