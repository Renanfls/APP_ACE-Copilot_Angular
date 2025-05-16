require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function recreateAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-copilot', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Find existing admin
    const existingAdmin = await User.findOne({
      companyCode: '0123',
      registration: '000000'
    });

    if (existingAdmin) {
      console.log('Admin user found. Updating status...');
      existingAdmin.status = 'approved';
      await existingAdmin.save();
      console.log('Admin user status updated to approved');
    } else {
      // Create new admin user
      console.log('Creating new admin user...');
      const adminUser = new User({
        name: 'Administrador',
        email: 'admin@acecopilot.com',
        registration: '000000',
        phone: '(00) 00000-0000',
        companyCode: '0123',
        password: 'admin123',  // Will be hashed by pre-save middleware
        status: 'approved'
      });

      await adminUser.save();
      console.log('New admin user created successfully');
    }

    // Verify the admin
    const admin = await User.findOne({
      companyCode: '0123',
      registration: '000000'
    });

    if (admin) {
      console.log('\nAdmin user verification:');
      console.log('- User exists: YES');
      console.log('- Company Code:', admin.companyCode);
      console.log('- Registration:', admin.registration);
      console.log('- Status:', admin.status);
      
      const isMatch = await admin.comparePassword('admin123');
      console.log('- Password verification:', isMatch ? 'SUCCESS' : 'FAILED');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

recreateAdmin(); 