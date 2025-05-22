import mongoose from 'mongoose';

const HorarioDisponivelSchema = new mongoose.Schema({
  medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medico',
    required: true
  },
  unidade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unidade',
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  horaInicio: {
    type: String,
    required: true
  },
  horaFim: {
    type: String,
    required: true
  },
  disponivel: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.HorarioDisponivel || mongoose.model('HorarioDisponivel', HorarioDisponivelSchema);
