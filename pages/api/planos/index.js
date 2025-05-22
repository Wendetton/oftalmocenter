import dbConnect from '../../../lib/mongodb';
import PlanoSaude from '../../../models/PlanoSaude';
import { protect } from '../../../lib/auth';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      try {
        const planos = await PlanoSaude.find({ ativo: true });
        res.status(200).json({ success: true, data: planos });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST':
      // Proteger rota de criação
      return protect(req, res, async () => {
        try {
          const plano = await PlanoSaude.create(req.body);
          res.status(201).json({ success: true, data: plano });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      });
      
    default:
      res.status(400).json({ success: false, message: 'Método não suportado' });
      break;
  }
}
