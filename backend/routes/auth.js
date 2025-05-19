const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { auth, adminAuth } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Create admin user if it doesn't exist
async function createAdminIfNotExists() {
  try {
    const adminExists = await User.findOne({ 
      companyCode: '0123',
      registration: '000000'
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        name: 'Administrador',
        email: 'admin@acecopilot.com',
        registration: '000000',
        phone: '(00) 00000-0000',
        companyCode: '0123',
        password: hashedPassword,
        status: 'approved',
        isAdmin: true
      });

      await adminUser.save();
      console.log('Usuário admin criado com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  }
}

// Call the function when the server starts
createAdminIfNotExists();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, registration, phone, companyCode, password } = req.body;

    console.log('Recebendo requisição de registro:', {
      name,
      email,
      registration: registration?.toString(),
      phone,
      companyCode,
      password: '***'
    });

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { registration: registration?.toString() }
      ]
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }
      if (existingUser.registration === registration?.toString()) {
        return res.status(400).json({ message: 'Matrícula já cadastrada' });
      }
    }

    // Validate registration format
    const registrationStr = registration?.toString() || '';
    if (!registrationStr.match(/^\d{6,}$/)) {
      return res.status(400).json({ 
        message: 'Matrícula deve ter no mínimo 6 dígitos e conter apenas números',
        details: {
          received: registrationStr,
          length: registrationStr.length,
          isNumeric: /^\d+$/.test(registrationStr)
        }
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      registration: registrationStr,
      phone,
      companyCode,
      password
    });

    await user.save();

    const savedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      registration: user.registration,
      companyCode: user.companyCode,
      status: user.status
    };

    console.log('Usuário registrado com sucesso:', savedUser);

    // Tenta enviar notificação WebSocket
    let notificationSent = false;
    try {
      if (typeof global.notifyClients === 'function') {
        notificationSent = global.notifyClients({
          type: 'USER_REGISTERED',
          data: savedUser
        });
      }
    } catch (notificationError) {
      console.warn('Erro ao enviar notificação WebSocket:', notificationError);
      // Não propaga o erro, apenas loga
    }

    // Retorna sucesso mesmo se a notificação falhar
    return res.status(201).json({ 
      message: 'Solicitação enviada com sucesso! Aguarde a aprovação do administrador.',
      user: savedUser,
      notificationSent
    });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    
    // Trata erros específicos de validação do Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Erro de validação', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    // Trata erros de duplicação do MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field === 'email' ? 'Email' : 'Matrícula'} já cadastrado(a)`
      });
    }

    // Para outros erros, retorna uma mensagem genérica
    return res.status(500).json({ 
      message: 'Erro ao registrar usuário. Tente novamente.'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { companyCode, registration, password } = req.body;
    
    console.log('\n=== Nova Tentativa de Login ===');
    console.log('Dados recebidos:', {
      companyCode: companyCode,
      registration: registration,
      passwordLength: password ? password.length : 0
    });

    // Validação dos campos
    if (!companyCode || !registration || !password) {
      console.log('Erro: Campos obrigatórios faltando');
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Find user
    console.log('\nBuscando usuário...');
    const searchCriteria = {
      registration: registration.trim(),
      companyCode: companyCode.trim()
    };
    console.log('Critérios de busca:', searchCriteria);
    
    const user = await User.findOne(searchCriteria);

    if (!user) {
      console.log('Erro: Usuário não encontrado');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    console.log('Usuário encontrado:', {
      id: user._id,
      name: user.name,
      email: user.email,
      registration: user.registration,
      companyCode: user.companyCode,
      status: user.status,
      isAdmin: user.isAdmin
    });

    // Check password
    console.log('\nVerificando senha...');
    const isMatch = await user.comparePassword(password.trim());
    console.log('Senha corresponde:', isMatch);

    if (!isMatch) {
      console.log('Erro: Senha incorreta');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Generate token for all authenticated users
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'ace-copilot-secret-key-2024',
      { expiresIn: '24h' }
    );

    // Return success response with user status
    console.log('Login bem-sucedido!');
    console.log('Detalhes do usuário:', {
      id: user._id,
      name: user.name,
      email: user.email,
      registration: user.registration,
      companyCode: user.companyCode,
      status: user.status,
      isAdmin: user.isAdmin
    });

    // Return user data with token
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        companyCode: user.companyCode,
        registration: user.registration,
        status: user.status,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
  }
});

// Get pending users (admin only)
router.get('/pending-users', auth, adminAuth, async (req, res) => {
  try {
    console.log('=== Buscando usuários ===');
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    console.log(`Encontrados ${users.length} usuários`);

    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      companyCode: user.companyCode,
      registration: user.registration,
      status: user.status,
      createdAt: user.createdAt,
      isAdmin: user.isAdmin
    }));

    console.log('Enviando lista de usuários');
    res.json(formattedUsers);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar usuários', 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Approve user
router.patch('/users/:userId/status', auth, adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Tenta notificar os clientes, mas não falha se der erro
    try {
      if (typeof global.notifyClients === 'function') {
        global.notifyClients({
          type: 'USER_STATUS_CHANGED',
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            registration: user.registration,
            status: user.status
          }
        });
      }
    } catch (notificationError) {
      console.warn('Erro ao enviar notificação WebSocket:', notificationError);
      // Não propaga o erro, apenas loga
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao atualizar status do usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar status do usuário' });
  }
});

module.exports = router; 