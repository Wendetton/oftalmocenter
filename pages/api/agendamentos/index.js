import dbConnect from '../../lib/mongodb';
import Agendamento from '../../models/Agendamento';
import HorarioDisponivel from '../../models/HorarioDisponivel';
import { validarCPF, validarEmail, validarTelefone } from '../../lib/auth';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      try {
        const { medico, unidade, data, status } = req.query;
        
        // Construir filtro
        const filtro = {};
        
        if (medico) filtro.medico = medico;
        if (unidade) filtro.unidade = unidade;
        if (data) filtro.dataConsulta = new Date(data);
        if (status) filtro.status = status;
        
        const agendamentos = await Agendamento.find(filtro)
          .populate('medico')
          .populate('unidade')
          .populate('plano')
          .sort({ dataConsulta: 1, horaConsulta: 1 });
          
        res.status(200).json({ success: true, data: agendamentos });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST':
      try {
        const { 
          nomeCliente, 
          sexo, 
          dataNascimento, 
          cpf, 
          telefone, 
          email,
          medico,
          unidade,
          plano,
          horarioId
        } = req.body;
        
        // Validar dados
        if (!nomeCliente || !sexo || !dataNascimento || !cpf || !telefone || !email || !medico || !unidade || !plano || !horarioId) {
          return res.status(400).json({ success: false, message: 'Dados incompletos' });
        }
        
        // Validar CPF
        if (!validarCPF(cpf)) {
          return res.status(400).json({ success: false, message: 'CPF inválido' });
        }
        
        // Validar e-mail
        if (!validarEmail(email)) {
          return res.status(400).json({ success: false, message: 'E-mail inválido' });
        }
        
        // Validar telefone
        if (!validarTelefone(telefone)) {
          return res.status(400).json({ success: false, message: 'Telefone inválido' });
        }
        
        // Buscar horário
        const horario = await HorarioDisponivel.findById(horarioId);
        if (!horario || !horario.disponivel) {
          return res.status(400).json({ success: false, message: 'Horário indisponível' });
        }
        
        // Criar agendamento
        const agendamento = await Agendamento.create({
          nomeCliente,
          sexo,
          dataNascimento: new Date(dataNascimento),
          cpf,
          telefone,
          email,
          medico,
          unidade,
          plano,
          dataConsulta: horario.data,
          horaConsulta: horario.horaInicio,
          status: 'Agendado'
        });
        
        // Marcar horário como indisponível
        horario.disponivel = false;
        await horario.save();
        
        // TODO: Enviar confirmações (WhatsApp e e-mail)
        
        res.status(201).json({ success: true, data: agendamento });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(400).json({ success: false, message: 'Método não suportado' });
      break;
  }
}
