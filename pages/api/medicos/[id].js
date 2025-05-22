import dbConnect from '../../lib/mongodb';
import Medico from '../../models/Medico';
import { protect } from '../../lib/auth';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      try {
        const medico = await Medico.findById(id).populate('unidades');
        
        if (!medico) {
          return res.status(404).json({ success: false, message: 'Médico não encontrado' });
        }
        
        res.status(200).json({ success: true, data: medico });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'PUT':
      // Proteger rota de atualização
      return protect(req, res, async () => {
        try {
          const medico = await Medico.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
          
          if (!medico) {
            return res.status(404).json({ success: false, message: 'Médico não encontrado' });
          }
          
          res.status(200).json({ success: true, data: medico });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      });
      
    case 'DELETE':
      // Proteger rota de exclusão
      return protect(req, res, async () => {
        try {
          const medico = await Medico.findByIdAndUpdate(id, { ativo: false }, {
            new: true,
          });
          
          if (!medico) {
            return res.status(404).json({ success: false, message: 'Médico não encontrado' });
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
