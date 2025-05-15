require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function updateAdmin() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-copilot', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB');

    // Encontrar o admin existente
    const adminId = "68262484d5efce6f39dbb9e1";
    const admin = await User.findById(adminId);

    if (admin) {
      console.log('Admin encontrado. Atualizando credenciais...');
      
      // Hash da nova senha
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Atualizar admin
      await User.findByIdAndUpdate(adminId, {
        companyCode: '0123',
        password: hashedPassword
      });

      console.log('Admin atualizado com sucesso!');
      console.log('\nNovas credenciais do admin:');
      console.log('Código da empresa: 0123');
      console.log('Matrícula: 000000');
      console.log('Senha: admin123');

      // Verificar se a atualização funcionou
      const updatedAdmin = await User.findById(adminId);
      console.log('\nDetalhes atualizados do admin:', {
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        registration: updatedAdmin.registration,
        companyCode: updatedAdmin.companyCode,
        status: updatedAdmin.status
      });
    } else {
      console.log('Admin não encontrado!');
    }

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado do MongoDB');
  }
}

updateAdmin(); 