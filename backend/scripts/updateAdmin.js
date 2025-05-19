require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGODB_URI = 'mongodb+srv://copilot:Copilot128@ace-copilot.qwvgn2f.mongodb.net/?retryWrites=true&w=majority&appName=ACE-COPILOT';

async function updateAdmin() {
  try {
    console.log('Conectando ao MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB Atlas');

    // Primeiro, vamos remover qualquer usuário admin existente para garantir um estado limpo
    console.log('Removendo usuário admin existente...');
    await User.deleteOne({ registration: '000000' });
    console.log('Usuário admin removido (se existia)');

    // Criar novo usuário admin
    console.log('Criando novo usuário admin...');
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    const newAdmin = new User({
      name: 'Administrador',
      email: 'admin@acecopilot.com',
      registration: '000000',
      phone: '(00) 00000-0000',
      companyCode: '0123',
      password: hashedPassword,
      status: 'approved',
      isAdmin: true
    });

    await newAdmin.save();
    console.log('Novo usuário admin criado com sucesso!');

    // Verificar se o usuário foi criado corretamente
    const createdAdmin = await User.findOne({ registration: '000000' });
    if (!createdAdmin) {
      throw new Error('Falha ao criar usuário admin - não encontrado após criação');
    }

    console.log('\nDetalhes do admin criado:', {
      id: createdAdmin._id,
      name: createdAdmin.name,
      email: createdAdmin.email,
      registration: createdAdmin.registration,
      companyCode: createdAdmin.companyCode,
      status: createdAdmin.status,
      isAdmin: createdAdmin.isAdmin
    });

    // Testar a senha
    console.log('\nTestando autenticação...');
    const isMatch = await createdAdmin.comparePassword(plainPassword);
    console.log('Teste de senha:', isMatch ? 'SUCESSO' : 'FALHA');
    
    if (!isMatch) {
      console.log('AVISO: A senha não está funcionando corretamente!');
      console.log('Hash da senha armazenada:', createdAdmin.password);
    } else {
      console.log('\nCredenciais de acesso:');
      console.log('Código da empresa:', createdAdmin.companyCode);
      console.log('Matrícula:', createdAdmin.registration);
      console.log('Senha:', plainPassword);
    }

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado do MongoDB Atlas');
  }
}

updateAdmin(); 