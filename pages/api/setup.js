import dbConnect from '../../lib/mongodb';
import Usuario from '../../models/Usuario';

export default async function handler(req, res) {
  const { method } = req;
  
  if (method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }
  
  await dbConnect();
  
  try {
    // Verificar se já existe um usuário admin
    const adminExists = await Usuario.findOne({ username: 'admin' });
    
    if (adminExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuário admin já existe. Use as credenciais padrão para fazer login.' 
      });
    }
    
    // Criar usuário admin padrão
    const admin = await Usuario.create({
      username: 'admin',
      password: 'admin',
      nome: 'Administrador',
      email: 'admin@oftalmocenter.com',
      ativo: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Usuário admin criado com sucesso. Use admin/admin para fazer login.',
      data: {
        username: admin.username,
        nome: admin.nome,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
