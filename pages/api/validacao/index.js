import dbConnect from '../../lib/mongodb';
import { validarCPF, validarEmail, validarTelefone } from '../../lib/auth';

export default async function handler(req, res) {
  const { method } = req;
  
  if (method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }
  
  await dbConnect();
  
  try {
    const { tipo, valor } = req.body;
    
    if (!tipo || !valor) {
      return res.status(400).json({ success: false, message: 'Dados incompletos' });
    }
    
    let valido = false;
    
    switch (tipo) {
      case 'cpf':
        valido = validarCPF(valor);
        break;
      case 'email':
        valido = validarEmail(valor);
        break;
      case 'telefone':
        valido = validarTelefone(valor);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Tipo de validação inválido' });
    }
    
    res.status(200).json({ success: true, valido });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
