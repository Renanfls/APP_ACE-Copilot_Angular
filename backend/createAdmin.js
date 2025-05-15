require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createAdminUser() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-copilot', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB');

    // Verificar se o admin já existe
    const adminExists = await User.findOne({ 
      companyCode: '0123',
      registration: '000000'
    });

    if (adminExists) {
      console.log('Usuário admin já existe. Atualizando credenciais...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.findByIdAndUpdate(adminExists._id, {
        password: hashedPassword,
        status: 'approved',
        companyCode: '0123'  // Ensure correct company code
      });
      console.log('Credenciais do admin atualizadas com sucesso!');
    } else {
      // Criar novo usuário admin
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

    console.log('\nCredenciais do admin:');
    console.log('Código da empresa: 0123');
    console.log('Matrícula: 000000');
    console.log('Senha: admin123');

    // Print admin user details for verification
    const admin = await User.findOne({ registration: '000000' }).select('-password');
    console.log('\nDetalhes do usuário admin:', admin);

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  }
}

createAdminUser(); 