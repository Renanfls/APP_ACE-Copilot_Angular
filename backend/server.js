require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const http = require('http');
const { Server } = require('socket.io');

// Definir variáveis de ambiente se não existirem
process.env.JWT_SECRET = process.env.JWT_SECRET || 'ace-copilot-secret-key-2024';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://copilot:Copilot128@ace-copilot.qwvgn2f.mongodb.net/?retryWrites=true&w=majority&appName=ACE-COPILOT';

const app = express();
const server = http.createServer(app);

// Configuração do Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Armazena clientes conectados
const connectedClients = new Set();

// Configuração do Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  connectedClients.add(socket);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    connectedClients.delete(socket);
  });
});

// Função global de notificação
global.notifyClients = function(notification) {
  try {
    console.log('Enviando notificação para todos os clientes:', notification);
    io.emit('notification', notification);
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return false;
  }
};

// Middleware
app.use(cors({
  origin: '*',
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
      console.log('Status de admin:', adminUser.isAdmin);
    } else {
      // Atualiza o admin existente
      adminExists.password = 'admin123'; // Será hasheado automaticamente pelo middleware
      adminExists.isAdmin = true; // Garante que é admin
      adminExists.status = 'approved'; // Garante que está aprovado
      await adminExists.save();
      console.log('Admin atualizado com sucesso!');
      
      // Verifica se as atualizações foram aplicadas
      const isMatch = await adminExists.comparePassword('admin123');
      console.log('Verificação da senha após atualização:', isMatch);
      console.log('Status de admin:', adminExists.isAdmin);
      console.log('Status de aprovação:', adminExists.status);
    }

    // Verificação final
    const finalCheck = await User.findOne({ registration: '000000' });
    if (finalCheck) {
      console.log('\nVerificação final do usuário admin:', {
        isAdmin: finalCheck.isAdmin,
        status: finalCheck.status,
        companyCode: finalCheck.companyCode,
        registration: finalCheck.registration
      });
    }
  } catch (error) {
    console.error('Erro ao criar/atualizar usuário admin:', error);
  }
}

// Connect to MongoDB Atlas
console.log('Tentando conectar ao MongoDB Atlas...');
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
      status: adminUser.status,
      isAdmin: adminUser.isAdmin
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

const PORT = 5001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`API disponível em http://192.168.0.9:${PORT}`);
  console.log('WebSocket server iniciado');
}); 