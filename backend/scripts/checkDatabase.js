require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function checkDatabase() {
  try {
    console.log('Tentando conectar ao MongoDB...');
    console.log('URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-copilot');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-copilot', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB com sucesso!');

    // Verificar todos os usuários
    const users = await User.find();
    console.log('\nTotal de usuários no banco:', users.length);
    
    // Procurar usuário admin
    const admin = await User.findOne({ 
      registration: '000000',
      companyCode: '0123'
    });

    console.log('\nUsuário admin encontrado:', admin ? 'Sim' : 'Não');
    if (admin) {
      console.log('Detalhes completos do admin:');
      console.log({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        registration: admin.registration,
        companyCode: admin.companyCode,
        status: admin.status,
        hashedPassword: admin.password
      });

      // Testar senha
      const testPassword = 'admin123';
      const passwordMatch = await bcrypt.compare(testPassword, admin.password);
      console.log('\nTeste de senha:');
      console.log('Senha testada:', testPassword);
      console.log('Senha corresponde:', passwordMatch);
    }

    // Listar todos os usuários
    console.log('\nLista de todos os usuários:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.registration}, ${user.companyCode}, status: ${user.status})`);
    });

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado do MongoDB');
  }
}

checkDatabase(); 