# Oftalmocenter - Plataforma de Agendamento

Plataforma completa para agendamento online de consultas para a clínica oftalmológica Oftalmocenter, com interface intuitiva para clientes e painel administrativo para a equipe da clínica.

## Funcionalidades

### Central de Agendamentos (Cliente)
- Interface intuitiva, moderna e responsiva
- Processo de agendamento em etapas sequenciais
- Seleção de unidade, médico, plano de saúde e horário
- Validação automática de dados do paciente
- Confirmação por WhatsApp e e-mail

### Central de Controle (Admin)
- Painel administrativo completo
- Gerenciamento de unidades, médicos e planos de saúde
- Configuração de horários disponíveis
- Visualização e gerenciamento de agendamentos
- Personalização de mensagens de confirmação

## Tecnologias Utilizadas

- **Frontend**: Next.js, React, Bootstrap 5
- **Backend**: API Routes do Next.js
- **Banco de Dados**: MongoDB Atlas
- **Hospedagem**: Vercel

## Instalação e Deploy

Consulte o arquivo [DEPLOY.md](DEPLOY.md) para instruções detalhadas sobre como fazer o deploy da plataforma na Vercel.

## Estrutura do Projeto

```
oftalmocenter-vercel/
├── lib/                  # Bibliotecas e utilitários
│   ├── mongodb.js        # Conexão com MongoDB
│   └── auth.js           # Autenticação e autorização
├── models/               # Modelos de dados
├── pages/                # Páginas e rotas da aplicação
│   ├── api/              # API Routes (backend)
│   ├── admin/            # Páginas administrativas
│   ├── _app.js           # Configuração global do Next.js
│   ├── _document.js      # Documento HTML base
│   └── index.js          # Página inicial (agendamento)
├── public/               # Arquivos estáticos
│   └── img/              # Imagens, incluindo logo
├── styles/               # Estilos CSS
├── vercel.json           # Configuração da Vercel
└── package.json          # Dependências e scripts
```

## Configuração Inicial

Após o deploy, acesse a URL da sua aplicação seguida de `/api/setup` para criar o usuário administrativo inicial. Em seguida, acesse a área administrativa em `/admin` e faça login com as credenciais padrão (admin/admin).

## Personalização

- Cores e estilos podem ser personalizados no arquivo `styles/globals.css`
- A logo pode ser substituída em `public/img/logo.png`
- Mensagens de confirmação podem ser personalizadas na área administrativa

## Licença

Este projeto é proprietário e de uso exclusivo da Oftalmocenter.
