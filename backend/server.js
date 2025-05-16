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
    console.log('\n=== Verificando/Criando usuário admin ===');
    const adminExists = await User.findOne({ 
      companyCode: '0123',
      registration: '000000'
    });

    if (!adminExists) {
      const adminUser = new User({
        name: 'Administrador',
        email: 'admin@acecopilot.com',
        registration: '000000',
        phone: '(00) 00000-0000',
        companyCode: '0123',
        password: 'admin123', // Será hasheado automaticamente pelo middleware
        status: 'approved',
        isAdmin: true
      });

      await adminUser.save();
      console.log('Usuário admin criado com sucesso!');
      
      // Verifica se a senha foi criada corretamente
      const isMatch = await adminUser.comparePassword('admin123');
      console.log('Verificação da senha após criação:', isMatch);
    } else {
      // Atualiza a senha do admin existente
      adminExists.password = 'admin123'; // Será hasheado automaticamente pelo middleware
      adminExists.isAdmin = true;
      await adminExists.save();
      console.log('Senha do admin atualizada com sucesso!');
      
      // Verifica se a senha foi atualizada corretamente
      const isMatch = await adminExists.comparePassword('admin123');
      console.log('Verificação da senha após atualização:', isMatch);
    }
  } catch (error) {
    console.error('Erro ao criar/atualizar usuário admin:', error);
  }
}

// Connect to MongoDB Atlas
console.log('Tentando conectar ao MongoDB Atlas...');
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI não está definido no arquivo .env');
  process.exit(1);
}
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Conectado ao MongoDB Atlas com sucesso!');
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
  console.error('Erro ao conectar ao MongoDB Atlas:', err);
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
  // console.log(`API disponível em http://192.168.0.9:${PORT}`);
}); 