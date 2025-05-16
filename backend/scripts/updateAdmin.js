require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function updateAdmin() {
  try {
    console.log('Conectando ao MongoDB Atlas...');
    await mongoose.connect('mongodb+srv://copilot:Copilot128@ace-copilot.qwvgn2f.mongodb.net/?retryWrites=true&w=majority&appName=ACE-COPILOT', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB Atlas');

    // Encontrar o usuário admin
    const admin = await User.findOne({
      companyCode: '0123',
      registration: '000000'
    });

    if (admin) {
      console.log('Usuário admin encontrado. Atualizando campo isAdmin...');
      admin.isAdmin = true;
      await admin.save();
      console.log('Campo isAdmin atualizado com sucesso!');

      // Verificar a atualização
      const updatedAdmin = await User.findById(admin._id);
      console.log('\nDetalhes do usuário admin atualizado:', {
        id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        registration: updatedAdmin.registration,
        companyCode: updatedAdmin.companyCode,
        status: updatedAdmin.status,
        isAdmin: updatedAdmin.isAdmin
      });
    } else {
      console.log('Usuário admin não encontrado!');
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado do MongoDB Atlas');
  }
}

updateAdmin(); 