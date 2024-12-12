import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        nombre: {type: String, required: true},
        apellido: {type: String, required: true},
        email: {type: String, required: true},
        contraseña: {type: String, required: true},
    }
);

export default mongoose.model('User', userSchema);