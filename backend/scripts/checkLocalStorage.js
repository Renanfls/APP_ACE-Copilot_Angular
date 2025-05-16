const fs = require('fs');
const path = require('path');

// Simula o localStorage para testar a lógica
const mockLocalStorage = {
  getItem: (key) => {
    try {
      const data = fs.readFileSync(path.join(__dirname, 'localStorage.json'), 'utf8');
      const storage = JSON.parse(data);
      return storage[key] || null;
    } catch (error) {
      return null;
    }
  }
};

// Verifica o estado do usuário
const user = mockLocalStorage.getItem('user');
const token = mockLocalStorage.getItem('token');

console.log('=== Estado do LocalStorage ===');
console.log('Token:', token ? 'Presente' : 'Ausente');
console.log('\nDados do usuário:', user ? JSON.parse(user) : 'Ausente');

if (user) {
  const userData = JSON.parse(user);
  console.log('\nVerificação de Admin:');
  console.log('Company Code:', userData.companyCode);
  console.log('Registration:', userData.registration);
  console.log('É admin?', userData.companyCode === '0123' && userData.registration === '000000');
} 