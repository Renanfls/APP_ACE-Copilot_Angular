const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Erro de autenticação: Token não fornecido');
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ace-copilot-secret-key-2024');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.log('Erro de autenticação: Usuário não encontrado');
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    console.log('Usuário autenticado:', {
      id: user._id,
      name: user.name,
      email: user.email,
      registration: user.registration,
      status: user.status,
      isAdmin: user.isAdmin
    });

    req.user = user;
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    res.status(401).json({ message: 'Token inválido' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Erro de autenticação admin: Token não fornecido');
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ace-copilot-secret-key-2024');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.log('Erro de autenticação admin: Usuário não encontrado');
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    if (!user.isAdmin) {
      console.log('Erro de autenticação admin: Usuário não é administrador', {
        id: user._id,
        name: user.name,
        email: user.email,
        registration: user.registration,
        isAdmin: user.isAdmin
      });
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    }

    console.log('Administrador autenticado:', {
      id: user._id,
      name: user.name,
      email: user.email,
      registration: user.registration,
      status: user.status,
      isAdmin: user.isAdmin
    });

    req.user = user;
    next();
  } catch (error) {
    console.error('Erro de autenticação admin:', error);
    res.status(403).json({ message: 'Acesso negado' });
  }
};

module.exports = { auth, adminAuth }; 