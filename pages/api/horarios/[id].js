import dbConnect from '../../../lib/mongodb';
import HorarioDisponivel from '../../../models/HorarioDisponivel';
import { protect } from '../../../lib/auth';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      try {
        const horario = await HorarioDisponivel.findById(id)
          .populate('medico')
          .populate('unidade');
        
        if (!horario) {
          return res.status(404).json({ success: false, message: 'Horário não encontrado' });
        }
        
        res.status(200).json({ success: true, data: horario });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'PUT':
      // Proteger rota de atualização
      return protect(req, res, async () => {
        try {
          const horario = await HorarioDisponivel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
          
          if (!horario) {
            return res.status(404).json({ success: false, message: 'Horário não encontrado' });
          }
          
          res.status(200).json({ success: true, data: horario });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      });
      
    case 'DELETE':
      // Proteger rota de exclusão
      return protect(req, res, async () => {
        try {
          const horario = await HorarioDisponivel.findByIdAndDelete(id);
          
          if (!horario) {
            return res.status(404).json({ success: false, message: 'Horário não encontrado' });
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
