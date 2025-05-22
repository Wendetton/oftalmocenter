import dbConnect from '../../../lib/mongodb';
import Medico from '../../../models/Medico';
import { protect } from '../../../lib/auth';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      try {
        const medicos = await Medico.find({ ativo: true }).populate('unidades');
        res.status(200).json({ success: true, data: medicos });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST':
      // Proteger rota de criação
      return protect(req, res, async () => {
        try {
          const medico = await Medico.create(req.body);
          res.status(201).json({ success: true, data: medico });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      });
      
    default:
      res.status(400).json({ success: false, message: 'Método não suportado' });
      break;
  }
}
