import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from "../server.js";
import User from "../models/usuario.js";

let mongoServer;

jest.setTimeout(30000); // Aumentar timeout


  // Limpiar base de datos antes de cada prueba
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterEach(async () => {
    // Limpiar la base de datos después de cada prueba
    await User.deleteMany();
  });
  
  // Cerrar conexión de base de datos después de todas las pruebas
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("POST /auth/register", () => {
    it("debería registrar un nuevo usuario", async () => {
      const newUser = {
        name: "testuser",
        email: "testuser@example.com",
        password: "securepassword",
      };

      const response = await request(app).post("/auth/register").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Usuario registrado exitosamente.");
      expect(response.body.user).toHaveProperty("name", "testuser");
      expect(response.body.user).toHaveProperty("email", "testuser@example.com");
      expect(response.body.user).not.toHaveProperty("password"); // La contraseña no debe ser devuelta
    });

    it("debería devolver un error si el email ya está registrado", async () => {
      const existingUser = new User({
        name: "existinguser",
        email: "existinguser@example.com",
        password: "securepassword",
      });
      await existingUser.save();

      const newUser = {
        name: "testuser",
        email: "existinguser@example.com",
        password: "securepassword",
      };

      const response = await request(app).post("/auth/register").send(newUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /auth/login", () => {
    it("debería autenticar al usuario y devolver un token", async () => {
      const user = new User({
        name: "testuser",
        email: "testuser@example.com",
        password: "securepassword",
      });
      await user.save();

      const loginData = {
        email: "testuser@example.com",
        password: "securepassword",
      };

      const response = await request(app).post("/auth/login").send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("debería devolver un error si las credenciales son incorrectas", async () => {
      const user = new User({
        name: "testuser",
        email: "testuser@example.com",
        password: "securepassword",
      });
      await user.save();

      const loginData = {
        email: "testuser@example.com",
        password: "wrongpassword",
      };

      const response = await request(app).post("/auth/login").send(loginData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });
