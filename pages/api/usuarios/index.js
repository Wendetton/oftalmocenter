import dbConnect from '../../../lib/mongodb';
import Usuario from '../../../models/Usuario';
import { protect } from '../../../lib/auth';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();
  
  switch (method) {
    case 'GET':
      // Proteger rota de listagem
      return protect(req, res, async () => {
        try {
          const usuarios = await Usuario.find().select('-password');
          res.status(200).json({ success: true, data: usuarios });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      });
      
    case 'POST':
      // Proteger rota de criação
      return protect(req, res, async () => {
        try {
          // Verificar se usuário já existe
          const usuarioExistente = await Usuario.findOne({ username: req.body.username });
          
          if (usuarioExistente) {
            return res.status(400).json({ success: false, message: 'Nome de usuário já existe' });
          }
          
          const usuario = await Usuario.create(req.body);
          
          res.status(201).json({
            success: true,
            data: {
              id: usuario._id,
              nome: usuario.nome,
              email: usuario.email,
              username: usuario.username,
            },
          });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      });
      
    default:
      res.status(400).json({ success: false, message: 'Método não suportado' });
      break;
  }
}
