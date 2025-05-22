import dbConnect from '../../../lib/mongodb';
import Unidade from '../../../models/Unidade';
import { protect } from '../../../lib/auth';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      try {
        const unidades = await Unidade.find({ ativo: true });
        res.status(200).json({ success: true, data: unidades });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST':
      // Proteger rota de criação
      return protect(req, res, async () => {
        try {
          const unidade = await Unidade.create(req.body);
          res.status(201).json({ success: true, data: unidade });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      });
      
    default:
      res.status(400).json({ success: false, message: 'Método não suportado' });
      break;
  }
}
