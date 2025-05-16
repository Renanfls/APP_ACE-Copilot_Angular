const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-copilot', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully');

    // Check if admin exists
    const adminExists = await User.findOne({ 
      companyCode: '0123',  // Changed to meet minlength requirement
      registration: '000000'
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        name: 'Administrador',
        email: 'admin@acecopilot.com',
        registration: '000000',
        phone: '(00) 00000-0000',
        companyCode: '0123',  // Changed to meet minlength requirement
        password: hashedPassword,
        status: 'approved',
        isAdmin: true
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
      // Update admin user to ensure correct company code
      if (adminExists.companyCode !== '0123' || !adminExists.isAdmin) {
        adminExists.companyCode = '0123';
        adminExists.isAdmin = true;
        await adminExists.save();
        console.log('Updated admin company code and isAdmin flag');
      }
    }

    // Print admin user details
    const admin = await User.findOne({ registration: '000000' }).select('-password');
    console.log('Admin user details:', admin);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

main(); 