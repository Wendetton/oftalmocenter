import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Função para gerar token JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Middleware para proteger rotas
export const protect = async (req, res, handler) => {
  let token;
  
  if (req.headers.cookie) {
    try {
      // Obter token do cookie
      const cookies = cookie.parse(req.headers.cookie);
      token = cookies.token;
      
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Adicionar usuário ao request
      const Usuario = require('../models/Usuario').default;
      req.user = await Usuario.findById(decoded.id).select('-password');
      
      return handler(req, res);
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Não autorizado, token inválido' });
    }
  }
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Não autorizado, sem token' });
  }
};

// Função para validar CPF
export const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  let dv1 = resto < 2 ? 0 : 11 - resto;
  
  if (parseInt(cpf.charAt(9)) !== dv1) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  let dv2 = resto < 2 ? 0 : 11 - resto;
  
  if (parseInt(cpf.charAt(10)) !== dv2) return false;
  
  return true;
};

// Função para validar e-mail
export const validarEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

// Função para validar telefone
export const validarTelefone = (telefone) => {
  telefone = telefone.replace(/[^\d]/g, '');
  return telefone.length >= 10 && telefone.length <= 11;
};
