import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Evitar duplicados
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'], // Define roles si es necesario
      default: 'customer',
    },
    phone: { 
      type: String,
      unique: true,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: 'false',
    },
  }, {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  });

  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try{
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    }catch(error){
      next(error);
    }
  });
  
  // Método para verificar la contraseña
  userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
  
export default mongoose.model('User', userSchema);