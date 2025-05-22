import dbConnect from '../../../lib/mongodb';
import Usuario from '../../../models/Usuario';
import { generateToken } from '../../../lib/auth';
import cookie from 'cookie';

export default async function handler(req, res) {
  const { method } = req;
  
  if (method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }
  
  await dbConnect();
  
  try {
    const { username, password } = req.body;
    
    // Verificar se usuário existe
    const usuario = await Usuario.findOne({ username }).select('+password');
    
    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
    
    // Verificar senha
    const senhaCorreta = await usuario.matchPassword(password);
    
    if (!senhaCorreta) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
    
    // Gerar token
    const token = generateToken(usuario._id);
    
    // Configurar cookie
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      sameSite: 'strict',
      path: '/',
    }));
    
    res.status(200).json({
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
}
