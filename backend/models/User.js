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
    minlength: 6,
    validate: {
      validator: function(v) {
        return /^\d{6,}$/.test(v);
      },
      message: props => `${props.value} não é uma matrícula válida. Deve ter no mínimo 6 dígitos e conter apenas números.`
    }
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
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  try {
    // Só faz hash da senha se ela foi modificada ou é nova
    if (!this.isModified('password')) {
      return next();
    }

    // Gera um salt com fator 10
    const salt = await bcrypt.genSalt(10);
    
    // Faz o hash da senha com o salt
    const hashedPassword = await bcrypt.hash(this.password, salt);
    
    // Substitui a senha em texto plano pelo hash
    this.password = hashedPassword;
    
    console.log('Senha hasheada com sucesso');
    next();
  } catch (error) {
    console.error('Erro ao fazer hash da senha:', error);
    next(error);
  }
});

// Método para comparar senha
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Usa bcrypt.compare para comparar a senha fornecida com o hash armazenado
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Comparação de senha:', {
      candidatePassword,
      hashedPassword: this.password,
      isMatch
    });
    return isMatch;
  } catch (error) {
    console.error('Erro ao comparar senha:', error);
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema); 