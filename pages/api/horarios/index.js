import dbConnect from '../../../lib/mongodb';
import HorarioDisponivel from '../../../models/HorarioDisponivel';
import { protect } from '../../../lib/auth';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      try {
        const { medico, unidade, data_inicio, data_fim } = req.query;
        
        // Construir filtro
        const filtro = { disponivel: true };
        
        if (medico) filtro.medico = medico;
        if (unidade) filtro.unidade = unidade;
        
        if (data_inicio || data_fim) {
          filtro.data = {};
          if (data_inicio) filtro.data.$gte = new Date(data_inicio);
          if (data_fim) filtro.data.$lte = new Date(data_fim);
        }
        
        const horarios = await HorarioDisponivel.find(filtro)
          .populate('medico')
          .populate('unidade')
          .sort({ data: 1, horaInicio: 1 });
          
        res.status(200).json({ success: true, data: horarios });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST':
      // Proteger rota de criação
      return protect(req, res, async () => {
        try {
          const horario = await HorarioDisponivel.create(req.body);
          res.status(201).json({ success: true, data: horario });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      });
      
    default:
      res.status(400).json({ success: false, message: 'Método não suportado' });
      break;
  }
}
