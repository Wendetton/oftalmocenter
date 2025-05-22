import dbConnect from '../../../lib/mongodb';
import Agendamento from '../../../models/Agendamento';
import { protect } from '../../../lib/auth';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      try {
        const agendamento = await Agendamento.findById(id)
          .populate('medico')
          .populate('unidade')
          .populate('plano');
        
        if (!agendamento) {
          return res.status(404).json({ success: false, message: 'Agendamento não encontrado' });
        }
        
        res.status(200).json({ success: true, data: agendamento });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'PUT':
      // Proteger rota de atualização
      return protect(req, res, async () => {
        try {
          const agendamento = await Agendamento.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
          
          if (!agendamento) {
            return res.status(404).json({ success: false, message: 'Agendamento não encontrado' });
          }
          
          res.status(200).json({ success: true, data: agendamento });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      });
      
    case 'DELETE':
      // Proteger rota de exclusão
      return protect(req, res, async () => {
        try {
          const agendamento = await Agendamento.findByIdAndUpdate(id, { status: 'Cancelado' }, {
            new: true,
          });
          
          if (!agendamento) {
            return res.status(404).json({ success: false, message: 'Agendamento não encontrado' });
          }
          
          res.status(200).json({ success: true, data: {} });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      });
      
    default:
      res.status(400).json({ success: false, message: 'Método não suportado' });
      break;
  }
}
