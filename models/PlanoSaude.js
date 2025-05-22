import mongoose from 'mongoose';

const PlanoSaudeSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, informe o nome do plano de saúde'],
    trim: true,
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

export default mongoose.models.PlanoSaude || mongoose.model('PlanoSaude', PlanoSaudeSchema);
