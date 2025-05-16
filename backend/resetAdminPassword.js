require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-copilot', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({
      companyCode: '0123',
      registration: '000000'
    });

    if (admin) {
      console.log('Admin user found. Resetting password...');
      
      // Hash new password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Update admin password
      admin.password = hashedPassword;
      await admin.save();

      console.log('Admin password reset successfully!');
      console.log('\nAdmin credentials:');
      console.log('Company Code: 0123');
      console.log('Registration: 000000');
      console.log('Password: admin123');
      
      // Test the new password
      const isMatch = await admin.comparePassword('admin123');
      console.log('\nPassword verification test:', isMatch ? 'SUCCESS' : 'FAILED');
      
    } else {
      console.log('Admin user not found. Creating new admin...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = new User({
        name: 'Administrador',
        email: 'admin@acecopilot.com',
        registration: '000000',
        phone: '(00) 00000-0000',
        companyCode: '0123',
        password: hashedPassword,
        status: 'approved'
      });

      await newAdmin.save();
      console.log('New admin user created successfully!');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetAdminPassword(); 