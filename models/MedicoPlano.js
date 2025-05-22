import mongoose from 'mongoose';

const MedicoPlanoSchema = new mongoose.Schema({
  medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medico',
    required: true
  },
  plano: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlanoSaude',
    required: true
  },
  valorConsulta: {
    type: Number,
    default: null
  }
});

export default mongoose.models.MedicoPlano || mongoose.model('MedicoPlano', MedicoPlanoSchema);
