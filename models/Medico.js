import mongoose from 'mongoose';

const MedicoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, informe o nome do médico'],
    trim: true,
  },
  especialidade: {
    type: String,
    default: 'Médico Oftalmologista',
    trim: true,
  },
  fotoPath: {
    type: String,
    default: '/img/medico-default.jpg',
  },
  ativo: {
    type: Boolean,
    default: true,
  },
  unidades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unidade'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Medico || mongoose.model('Medico', MedicoSchema);
