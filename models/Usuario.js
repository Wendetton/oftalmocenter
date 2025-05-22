import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UsuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Por favor, informe o nome de usuário'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Por favor, informe a senha'],
    minlength: [4, 'A senha deve ter pelo menos 4 caracteres'],
    select: false,
  },
  nome: {
    type: String,
    required: [true, 'Por favor, informe o nome completo'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe o e-mail'],
    trim: true,
    lowercase: true,
  },
  ativo: {
    type: Boolean,
    default: true,
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
});

// Criptografar senha antes de salvar
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar senha
UsuarioSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);
