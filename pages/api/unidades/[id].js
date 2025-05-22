import dbConnect from '../../lib/mongodb';
import Unidade from '../../models/Unidade';
import { protect } from '../../lib/auth';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      try {
        const unidade = await Unidade.findById(id);
        
        if (!unidade) {
          return res.status(404).json({ success: false, message: 'Unidade não encontrada' });
        }
        
        res.status(200).json({ success: true, data: unidade });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'PUT':
      // Proteger rota de atualização
      return protect(req, res, async () => {
        try {
          const unidade = await Unidade.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
          
          if (!unidade) {
            return res.status(404).json({ success: false, message: 'Unidade não encontrada' });
          }
          
          res.status(200).json({ success: true, data: unidade });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      });
      
    case 'DELETE':
      // Proteger rota de exclusão
      return protect(req, res, async () => {
        try {
          const unidade = await Unidade.findByIdAndUpdate(id, { ativo: false }, {
            new: true,
          });
          
          if (!unidade) {
            return res.status(404).json({ success: false, message: 'Unidade não encontrada' });
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
