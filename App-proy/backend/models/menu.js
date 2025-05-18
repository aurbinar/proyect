import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
    {
        date: {type: String, required: true, unique: true},
        primeros:{
            type: [String],
            required: true,
        },
        segundos:{ 
            type: [String],
            required: true,
        },
        especial:{
            type: [String],
            required: true,
        },
        postres:{
            type: [String],
            required: true,
        },
        precio:{
            type: String,
            required: true,
        }
    }
);

export default mongoose.model('Menu', menuSchema);