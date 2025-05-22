import mongoose from 'mongoose';

const UnidadeSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, informe o nome da unidade'],
    trim: true,
  },
  endereco: {
    type: String,
    required: [true, 'Por favor, informe o endereço da unidade'],
    trim: true,
  },
  telefone: {
    type: String,
    required: [true, 'Por favor, informe o telefone da unidade'],
    trim: true,
  },
  imagemPath: {
    type: String,
    default: '/img/unidade-default.jpg',
  },
  ativo: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Unidade || mongoose.model('Unidade', UnidadeSchema);
