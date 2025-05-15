require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function testLogin() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-copilot', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB');

    const credentials = {
      companyCode: '0123',
      registration: '000000',
      password: 'admin123'
    };

    console.log('\nTestando login com credenciais:', {
      ...credentials,
      password: '***'
    });

    // Buscar usuário
    const user = await User.findOne({
      companyCode: credentials.companyCode,
      registration: credentials.registration
    });

    if (!user) {
      console.log('Erro: Usuário não encontrado');
      return;
    }

    console.log('\nUsuário encontrado:', {
      id: user._id,
      name: user.name,
      email: user.email,
      registration: user.registration,
      companyCode: user.companyCode,
      status: user.status
    });

    // Testar senha
    console.log('\nTestando senha...');
    const isMatch = await user.comparePassword(credentials.password);
    console.log('Senha corresponde:', isMatch);

    if (isMatch) {
      console.log('\nLogin seria bem-sucedido!');
    } else {
      console.log('\nLogin falharia: senha incorreta');
    }

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado do MongoDB');
  }
}

testLogin(); 