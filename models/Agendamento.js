import mongoose from 'mongoose';

const AgendamentoSchema = new mongoose.Schema({
  nomeCliente: {
    type: String,
    required: [true, 'Por favor, informe o nome do cliente'],
    trim: true,
  },
  sexo: {
    type: String,
    required: [true, 'Por favor, informe o sexo'],
    enum: ['Masculino', 'Feminino', 'Não Informar'],
  },
  dataNascimento: {
    type: Date,
    required: [true, 'Por favor, informe a data de nascimento'],
  },
  cpf: {
    type: String,
    required: [true, 'Por favor, informe o CPF'],
    trim: true,
  },
  telefone: {
    type: String,
    required: [true, 'Por favor, informe o telefone'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe o e-mail'],
    trim: true,
    lowercase: true,
  },
  medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medico',
    required: true,
  },
  unidade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unidade',
    required: true,
  },
  plano: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlanoSaude',
    required: true,
  },
  dataConsulta: {
    type: Date,
    required: true,
  },
  horaConsulta: {
    type: String,
    required: true,
  },
  dataAgendamento: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Agendado', 'Confirmado', 'Cancelado', 'Realizado'],
    default: 'Agendado',
  },
});

export default mongoose.models.Agendamento || mongoose.model('Agendamento', AgendamentoSchema);
