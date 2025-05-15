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
        status: 'approved'
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

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { registration }
      ]
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }
      if (existingUser.registration === registration) {
        return res.status(400).json({ message: 'Matrícula já cadastrada' });
      }
    }

    // Create new user
    const user = new User({
      name,
      email,
      registration,
      phone,
      companyCode,
      password
    });

    await user.save();

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
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { companyCode, registration, password } = req.body;
    
    console.log('\n=== Nova Tentativa de Login ===');
    console.log('Dados recebidos (raw):', {
      companyCode: `"${companyCode}"`,
      registration: `"${registration}"`,
      password: '***'
    });
    console.log('Comprimentos:', {
      companyCode: companyCode.length,
      registration: registration.length,
      password: password.length
    });

    // Validação dos campos
    if (!companyCode || !registration || !password) {
      console.log('Erro: Campos obrigatórios faltando');
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (companyCode.length < 4) {
      console.log('Erro: Código da empresa muito curto');
      return res.status(400).json({ message: 'Código da empresa deve ter no mínimo 4 caracteres' });
    }

    if (registration.length < 6) {
      console.log('Erro: Matrícula muito curta');
      return res.status(400).json({ message: 'Matrícula deve ter no mínimo 6 caracteres' });
    }

    // Find user
    console.log('\nBuscando usuário...');
    console.log('Critérios de busca (exatos):', {
      registration: `"${registration.trim()}"`,
      companyCode: `"${companyCode.trim()}"`,
    });
    
    const user = await User.findOne({
      registration: registration.trim(),
      companyCode: companyCode.trim()
    });

    console.log('Usuário encontrado:', user ? {
      id: user._id,
      name: user.name,
      registration: `"${user.registration}"`,
      companyCode: `"${user.companyCode}"`,
      status: user.status
    } : 'Não');

    if (!user) {
      console.log('Erro: Usuário não encontrado');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Check password
    console.log('\nVerificando senha...');
    const isMatch = await user.comparePassword(password.trim());
    console.log('Senha corresponde:', isMatch);

    if (!isMatch) {
      console.log('Erro: Senha incorreta');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Check status
    console.log('\nVerificando status...');
    console.log('Status atual:', user.status);
    console.log('É admin?', user.companyCode === '0123' && user.registration === '000000');

    // Verificar apenas status bloqueado ou rejeitado
    if (user.status === 'rejected') {
      console.log('Erro: Usuário rejeitado');
      return res.status(401).json({ message: 'Sua conta foi rejeitada' });
    }

    if (user.status === 'blocked') {
      console.log('Erro: Usuário bloqueado');
      return res.status(401).json({ message: 'Sua conta está bloqueada. Entre em contato com o administrador.' });
    }

    // Generate JWT token
    console.log('\nGerando token JWT...');
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '24h' }
    );

    console.log('Login bem-sucedido para:', user.name);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        registration: user.registration,
        companyCode: user.companyCode,
        status: user.status
      }
    });
  } catch (error) {
    console.error('\nErro no processo de login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
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

    if (!['approved', 'rejected', 'blocked'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
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