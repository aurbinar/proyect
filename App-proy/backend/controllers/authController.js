import User from '../models/usuario.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import {registerSchema, loginSchema, recoverSchema, resetSchema} from "../schemas/validation.js";
import verifyEmailAddress from '../utils/verifyEmail.js';


// Controlador para registro
export const register = async (req, res) => {
	const { error } = registerSchema.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(400).json({ message: error.details[0].message });
	}
	const { name, email, password, phone } = req.body;

	try {
		// Verifica si el usuario ya existe
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: 'El correo ya está registrado.' });
		}

		const isValidEmail = await verifyEmailAddress(email);
		if (!isValidEmail) {
			return res.status(400).json({ message: 'La dirección de correo electrónico no es válida o no existe.' });
		}
	
		// Crea un nuevo usuario	
		const newUser = new User({ name, email, password, phone });
		await newUser.save();

		// Envía la respuesta con los datos del usuario (excluyendo la contraseña)
		res.status(201).json({
			message: 'Usuario registrado exitosamente.',
			user: {
				id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				phone: newUser.phone
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

		if (user.isBlocked) {
			return res.status(400).json({ message: 'Esta cuenta está bloqueada. Ponte en contacto con el administrador' })
		}

		// Generar token JWT
		const token = jwt.sign(
			{ id: user._id, role: user.role }, 
			process.env.JWT_SECRET,           
			{ expiresIn: '1d' }               
		);

		res.status(200).json({
			message: 'Inicio de sesión exitoso',
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phone: user.phone
			},
			token
		});
	} catch (error) {
		console.error('Error en login:', error);
		res.status(500).json({ message: 'Error al iniciar sesión', error });
	}
};

// Ruta para solicitar el restablecimiento de contraseña
export const recover = async (req, res) => {

	const { error } = recoverSchema.validate(req.body);
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}

	const { email } = req.body;

	try {
		// Verificar si el usuario existe
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: 'Correo no registrado' });

		// Generar un token JWT con tiempo de expiración
		const resetToken = jwt.sign(
			{ id: user._id, email: user.email }, // Payload
			process.env.JWT_SECRET, // Clave secreta
			{ expiresIn: '1h' } // Expira en 1 hora
		);

		// Crear enlace de restablecimiento
		const resetLink = `http://localhost:5173/reset/${resetToken}`;

		// Enviar correo al usuario
		await sendEmail(
			user.email,
			'Recuperación de contraseña',
			`Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`
		);

		res.status(200).json({ message: 'Correo enviado con instrucciones para restablecer la contraseña' });
	} catch (error) {
		res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
	}
};

// Ruta para restablecer la contraseña
export const resetPass = async (req, res) => {

	const { error } = resetSchema.validate(req.body);
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}

	const { token } = req.params;
	const { password } = req.body;

	try {
		// Verificar el token JWT
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Buscar al usuario en la base de datos
		const user = await User.findById(decoded.id);
		if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

		// Actualizar la contraseña
		user.password = password;
		await user.save();

		res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(400).json({ message: 'El token ha expirado' });
		}
		res.status(500).json({ message: 'Error al restablecer la contraseña', error: error.message });
	}
};

export const getMe = async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ message: 'No autenticado' });
	}

	return res.status(200).json({
		id: req.user._id,
		name: req.user.name,
		email: req.user.email,
		phone: req.user.phone,
		role: req.user.role,
	});
};