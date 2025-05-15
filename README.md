# Ace Copilot - Sistema de Gerenciamento de Usuários

## Configuração do Ambiente

### Pré-requisitos
- Node.js (v14 ou superior)
- MongoDB (v4.4 ou superior)
- Angular CLI

### Backend
1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na pasta backend com as seguintes variáveis:
```
MONGODB_URI=mongodb://localhost:27017/ace-copilot
JWT_SECRET=your-secret-key-here
PORT=5000
```

4. Inicie o servidor:
```bash
npm run dev
```

### Frontend
1. Na pasta raiz do projeto, instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
ng serve
```

## Acessando a Aplicação

- Frontend: http://localhost:4200
- Backend API: http://localhost:5000

## Usuário Admin Padrão
- Código da Empresa: 0123
- Matrícula: 000000
- Senha: admin123

## Funcionalidades

### Registro de Usuário
- Nome completo
- Email
- Telefone
- Código da empresa
- Senha

### Administração
- Aprovação/rejeição de novos usuários
- Visualização de usuários pendentes
- Gerenciamento de status dos usuários

### Autenticação
- Login com email e senha
- Proteção de rotas
- Tokens JWT

## API Endpoints

### Autenticação
- POST /api/auth/register - Registro de novo usuário
- POST /api/auth/login - Login de usuário
- GET /api/auth/pending-users - Lista usuários pendentes (requer autenticação de admin)
- PATCH /api/auth/users/:userId/status - Atualiza status do usuário (requer autenticação de admin)
