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

    console.log('Usuário registrado com sucesso:', {
      id: user._id,
      name: user.name,
      email: user.email,
      registration: user.registration,
      status: user.status
    });

    res.status(201).json({ 
      message: 'Solicitação enviada com sucesso! Aguarde a aprovação do administrador.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        registration: user.registration,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Erro de validação', 
        error: error.message,
        details: error.errors
      });
    }
    res.status(500).json({ 
      message: 'Erro ao registrar usuário', 
      error: error.message,
      details: error.stack
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
      registration: user.registration,
      companyCode: user.companyCode,
      status: user.status
    });

    // Check password
    console.log('\nVerificando senha...');
    const isMatch = await user.comparePassword(password.trim());
    console.log('Senha corresponde:', isMatch);

    if (!isMatch) {
      console.log('Erro: Senha incorreta');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Check status
    if (user.status !== 'approved') {
      console.log('Erro: Usuário não aprovado');
      return res.status(401).json({ 
        message: user.status === 'pending' 
          ? 'Aguardando aprovação do administrador'
          : 'Acesso negado'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Login bem-sucedido!');
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        registration: user.registration,
        status: user.status
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
router.get('/pending-users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      companyCode: user.companyCode,
      registration: user.registration,
      status: user.status,
      createdAt: user.createdAt
    })));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários pendentes', error: error.message });
  }
});

// Update user status (admin only)
router.patch('/users/:userId/status', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'blocked', 'unblocked'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    // If status is 'unblocked', set it to 'approved'
    const newStatus = status === 'unblocked' ? 'approved' : status;

    const user = await User.findByIdAndUpdate(
      userId,
      { status: newStatus },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status do usuário', error: error.message });
  }
});

module.exports = router; 