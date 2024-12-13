import User from '../models/usuario.js';
import jwt from 'jsonwebtoken';
import {registerSchema, loginSchema} from "../schemas/validation.js";


// Controlador para registro
export const register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { name, email, password } = req.body;
    try {
        // Verifica si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
        return res.status(400).json({ message: 'El correo ya está registrado.' });
        }
    
        // Crea un nuevo usuario
        const newUser = new User({ name, email, password });
        await newUser.save();
    
        // Envía la respuesta con los datos del usuario (excluyendo la contraseña)
        res.status(201).json({
        message: 'Usuario registrado exitosamente.',
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }
};

// Controlador para login
export const login = async (req, res) => {
  
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    
    
    const { email, password } = req.body;
    
    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    
        // Comparar contraseñas
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
        }
    
        // Generar token JWT
        const token = jwt.sign(
        { id: user._id, role: user.role }, // Información que irá en el token
        process.env.JWT_SECRET,           // Llave secreta
        { expiresIn: '1d' }               // Expira en 1 día
        );
    
        res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};