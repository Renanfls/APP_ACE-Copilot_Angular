const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-copilot', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const admin = await User.findOne({
      companyCode: '0123',
      registration: '000000'
    });

    if (admin) {
      console.log('Admin user found:', {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        registration: admin.registration,
        companyCode: admin.companyCode,
        status: admin.status,
        isAdmin: admin.isAdmin
      });

      // Test password
      const isMatch = await admin.comparePassword('admin123');
      console.log('Password match:', isMatch);
    } else {
      console.log('Admin user not found');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        name: 'Administrador',
        email: 'admin@acecopilot.com',
        registration: '000000',
        phone: '(00) 00000-0000',
        companyCode: '0123',
        password: hashedPassword,
        status: 'approved',
        isAdmin: true
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkAdmin(); 