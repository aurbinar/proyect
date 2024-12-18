import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js'; // Asegúrate de que apunte a tu servidor principal
import Menu from '../models/menu.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

describe('Pruebas para las rutas de /menu', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Menu.deleteMany({});
  });

  describe('PUT /api/updateMenu', () => {
    it('debería crear o actualizar el menú del día', async () => {
      const menuData = {
        primeros: ['Ensalada', 'Sopa'],
        segundos: ['Pollo', 'Pescado'],
        postres: ['Flan', 'Helado'],
        date: new Date().toISOString().split('T')[0],
      };

      const response = await request(app).put('/api/updateMenu').send(menuData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('primeros', menuData.primeros);
      expect(response.body).toHaveProperty('segundos', menuData.segundos);
      expect(response.body).toHaveProperty('postres', menuData.postres);
      expect(response.body).toHaveProperty('date', menuData.date);
    });

    it('debería actualizar un menú existente para la fecha actual', async () => {
      const today = new Date().toISOString().split('T')[0];

      const existingMenu = new Menu({
        primeros: ['Arroz'],
        segundos: ['Carne'],
        postres: ['Fruta'],
        date: today,
      });

      await existingMenu.save();

      const updatedMenuData = {
        primeros: ['Ensalada', 'Sopa'],
        segundos: ['Pollo', 'Pescado'],
        postres: ['Flan', 'Helado'],
        date: today,
      };

      const response = await request(app).put('/api/updateMenu').send(updatedMenuData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('primeros', updatedMenuData.primeros);
      expect(response.body).toHaveProperty('segundos', updatedMenuData.segundos);
      expect(response.body).toHaveProperty('postres', updatedMenuData.postres);
      expect(response.body).toHaveProperty('date', today);
    });
  });

  describe('GET /api/getMenu', () => {
    it('debería devolver el menú del día si existe', async () => {
      const today = new Date().toISOString().split('T')[0];

      const menu = new Menu({
        primeros: ['Ensalada'],
        segundos: ['Pollo'],
        postres: ['Flan'],
        date: today,
      });

      await menu.save();

      const response = await request(app).get('/api/getMenu');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('primeros', menu.primeros);
      expect(response.body).toHaveProperty('segundos', menu.segundos);
      expect(response.body).toHaveProperty('postres', menu.postres);
      expect(response.body).toHaveProperty('date', today);
    });

    it('debería devolver un error 404 si no hay menú para hoy', async () => {
      const response = await request(app).get('/api/getMenu');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'No hay menú para hoy');
    });
  });
});
