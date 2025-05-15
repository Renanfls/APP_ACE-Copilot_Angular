require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Create admin user function
async function createAdminUser() {
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
    } else {
      console.log('Usuário admin já existe');
      // Ensure admin has correct company code
      if (adminExists.companyCode !== '0123') {
        adminExists.companyCode = '0123';
        await adminExists.save();
        console.log('Código da empresa do admin atualizado para 0123');
      }
    }
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  }
}

// Connect to MongoDB
console.log('Tentando conectar ao MongoDB...');
console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-copilot');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-copilot', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Conectado ao MongoDB com sucesso!');
  await createAdminUser();
  
  // Log database status
  const adminUser = await User.findOne({ registration: '000000' });
  console.log('Status do usuário admin:', adminUser ? 'Encontrado' : 'Não encontrado');
  if (adminUser) {
    console.log('Detalhes do admin:', {
      companyCode: adminUser.companyCode,
      registration: adminUser.registration,
      status: adminUser.status
    });
  }
})
.catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err.stack);
  res.status(500).json({ message: 'Algo deu errado!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`API disponível em http://192.168.15.25:${PORT}`);
}); 