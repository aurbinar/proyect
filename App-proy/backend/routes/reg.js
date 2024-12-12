import { Router } from "express";
import User from "./models/usuarios.js";
const router = Router();

export const postUser = router.post('/register', async (req,res) => {
    const {nombre, apellido, email, password} = req.body;

    try{

    }catch(e){
        res.status(500).json({ message: 'Error al crear el Usuario', error });
    }
});

