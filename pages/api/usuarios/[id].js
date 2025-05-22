import dbConnect from '../../../lib/mongodb';
import Usuario from '../../../models/Usuario';
import { protect } from '../../../lib/auth';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  
  await dbConnect();
  
  // Proteger todas as rotas
  return protect(req, res, async () => {
    switch (method) {
      case 'GET':
        try {
          const usuario = await Usuario.findById(id).select('-password');
          
          if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
          }
          
          res.status(200).json({ success: true, data: usuario });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
        break;
        
      case 'PUT':
        try {
          // Verificar se está tentando atualizar o username
          if (req.body.username) {
            const usuarioExistente = await Usuario.findOne({ 
              username: req.body.username,
              _id: { $ne: id }
            });
            
            if (usuarioExistente) {
              return res.status(400).json({ success: false, message: 'Nome de usuário já existe' });
            }
          }
          
          const usuario = await Usuario.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          }).select('-password');
          
          if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
          }
          
          res.status(200).json({ success: true, data: usuario });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
        break;
        
      case 'DELETE':
        try {
          const usuario = await Usuario.findByIdAndUpdate(id, { ativo: false }, {
            new: true,
          });
          
          if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
          }
          
          res.status(200).json({ success: true, data: {} });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
        break;
        
      default:
        res.status(400).json({ success: false, message: 'Método não suportado' });
        break;
    }
  });
}
