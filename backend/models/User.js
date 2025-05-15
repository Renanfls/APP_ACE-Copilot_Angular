const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  registration: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  companyCode: {
    type: String,
    required: true,
    trim: true,
    minlength: 4
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'blocked'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    
    console.log('Hashando senha antes de salvar...');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Senha hasheada com sucesso');
    next();
  } catch (error) {
    console.error('Erro ao hashar senha:', error);
    next(error);
  }
});

// Hash password before updating
userSchema.pre('findOneAndUpdate', async function(next) {
  try {
    const update = this.getUpdate();
    if (update.password) {
      console.log('Hashando senha antes de atualizar...');
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
      console.log('Senha hasheada com sucesso');
    }
    next();
  } catch (error) {
    console.error('Erro ao hashar senha:', error);
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('\n=== Comparando Senhas ===');
    console.log('Senha fornecida (raw):', `"${candidatePassword}"`);
    console.log('Senha fornecida (comprimento):', candidatePassword.length);
    console.log('Hash armazenado:', this.password);
    console.log('Hash armazenado (comprimento):', this.password.length);
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Resultado da comparação:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Erro ao comparar senhas:', error);
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema); 