# Ace Copilot - Documentação da Estrutura do Aplicativo

## 📋 Visão Geral
O Ace Copilot é uma aplicação Angular moderna focada em gerenciamento de frotas e motoristas, com gamificação e monitoramento de desempenho.

## 🏗️ Estrutura do Aplicativo

### 📱 Componentes Principais

#### 1. FAQ (Perguntas Frequentes)
- Localização: `src/app/components/faq`
- Componente de acordeão para exibir perguntas e respostas frequentes
- Interface intuitiva com expansão/contração de seções
- Integração com ícones para melhor experiência visual

#### 2. Footer (Rodapé)
- Localização: `src/app/components/footer`
- Rodapé consistente em todas as páginas
- Links importantes e informações de copyright
- Responsivo para diferentes tamanhos de tela

#### 3. Header (Cabeçalho)
- Localização: `src/app/components/header`
- Barra de navegação principal
- Menu de usuário e configurações
- Alternador de tema claro/escuro
- Sistema de notificações integrado

#### 4. Gauge (Medidor)
- Localização: `src/app/components/gauge`
- Componente visual para exibição de métricas
- Medidores circulares animados
- Utilizado para mostrar progresso e estatísticas

#### 5. Game (Gamificação)
- Localização: `src/app/components/game`
- Sistema de gamificação para motoristas
- Ranking e sistema de pontuação
- Desafios e conquistas
- Recompensas e níveis

#### 6. Home (Página Inicial)
- Localização: `src/app/components/home`
- Dashboard principal
- Visão geral das principais métricas
- Acesso rápido às funcionalidades mais usadas

#### 7. Premiações
- Localização: `src/app/components/premiacoes`
- Sistema de recompensas
- Catálogo de prêmios
- Histórico de premiações
- Regras e critérios

#### 8. Profile (Perfil)
- Localização: `src/app/components/profile`
- Gerenciamento de perfil do usuário
- Upload de avatar
- Configurações pessoais
- Preferências de notificações e tema

#### 9. Score (Pontuação)
- Localização: `src/app/components/score`
- Sistema de pontuação detalhado
- Histórico de pontos
- Métricas de desempenho
- Gráficos e análises

#### 10. Statistics (Estatísticas)
- Localização: `src/app/components/statistics`
- Análises detalhadas
- Gráficos de desempenho
- Métricas comparativas
- Relatórios exportáveis

#### 11. Task (Tarefas)
- Localização: `src/app/components/task`
- Gerenciamento de tarefas
- Lista de atividades pendentes
- Histórico de conclusões
- Priorização de tarefas

#### 12. Turno
- Localização: `src/app/components/turno`
- Controle de turnos de trabalho
- Registro de início/fim
- Pausas e intervalos
- Relatórios de jornada

### 📊 Dashboards Especializados

#### DashVeículos
- Localização: `src/app/components/dash-veiculos`
- Monitoramento da frota
- Status dos veículos
- Manutenções programadas
- Consumo de combustível
- Quilometragem

#### DashDrive
- Localização: `src/app/components/dash-drive`
- Dashboard do motorista
- Desempenho individual
- Rotas realizadas
- Economia de combustível
- Pontuação de direção

## 🛠️ Tecnologias Utilizadas

### Core Dependencies
```bash
# Angular Core (v16.2.0)
@angular/animations
@angular/common
@angular/compiler
@angular/core
@angular/forms
@angular/platform-browser
@angular/platform-browser-dynamic
@angular/router

# Angular Material UI (v16.2.0)
@angular/material
@angular/cdk

# Icons and UI Components
@ng-icons/core@25.2.0
@ng-icons/material-icons@25.2.0
@ng-icons/heroicons@25.2.0
@spartan-ng/ui-button-helm@2.2.1

# State Management
rxjs@7.8.1
zone.js@0.13.0
```

### Development Dependencies
```bash
# Angular Development Tools
@angular-devkit/build-angular@16.2.0
@angular/cli@16.2.0
@angular/compiler-cli@16.2.0
@types/node@18.16.0
typescript@5.1.6

# Styling and UI
tailwindcss@3.3.3
postcss@8.4.27
autoprefixer@10.4.14

# Testing Framework
jasmine-core@4.6.0
karma@6.4.0
karma-chrome-launcher@3.2.0
karma-coverage@2.2.0
karma-jasmine@5.1.0
karma-jasmine-html-reporter@2.1.0

# Build Tools
nx@16.7.4
tslib@2.6.0
```

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js (versão 14.x ou superior)
- npm (versão 6.x ou superior)

### Passos para Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd app-ace-copilot
```

2. Instale as dependências
```bash
npm install
```

3. Inicie o servidor de desenvolvimento
```bash
npm start
```
O aplicativo estará disponível em `http://localhost:4200`

4. Para build de produção
```bash
npm run build
```
Os arquivos de build serão gerados na pasta `dist/`

## 🌐 Ambiente de Desenvolvimento

O aplicativo roda por padrão em:
- URL: `http://localhost:4200`
- API Backend: Configurável em `environment.ts`

## 🎨 Temas e Estilização

O aplicativo suporta:
- Modo claro e escuro
- Personalização via TailwindCSS
- Design responsivo
- Animações suaves

## 📦 Estrutura de Arquivos Principal

```
src/
├── app/
│   ├── components/
│   │   ├── faq/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── gauge/
│   │   ├── game/
│   │   ├── home/
│   │   ├── premiacoes/
│   │   ├── profile/
│   │   ├── score/
│   │   ├── statistics/
│   │   ├── task/
│   │   └── turno/
│   ├── services/
│   ├── interfaces/
│   └── shared/
├── assets/
└── environments/
```

## 🔐 Segurança

- Autenticação JWT
- Proteção de rotas
- Validação de formulários
- Sanitização de dados

## 📱 Responsividade

O aplicativo é totalmente responsivo, adaptando-se a:
- Desktops
- Tablets
- Smartphones
- Diferentes orientações de tela

## 🤝 Contribuição

Para contribuir com o projeto:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [Inserir tipo de licença].
