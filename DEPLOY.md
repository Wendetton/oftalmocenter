# Guia de Deploy na Vercel - Oftalmocenter

Este guia contém instruções detalhadas para fazer o deploy da plataforma de agendamento da Oftalmocenter na Vercel.

## Pré-requisitos

- Conta no GitHub
- Conta na Vercel
- Conta no MongoDB Atlas (banco de dados)

## Configuração do MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) e crie uma conta gratuita
2. Crie um novo cluster (a opção gratuita é suficiente)
3. Configure um usuário e senha para o banco de dados
4. Configure o acesso de rede para permitir conexões de qualquer lugar (0.0.0.0/0)
5. Obtenha a string de conexão, que será usada na configuração da Vercel

## Deploy na Vercel

1. Acesse [Vercel](https://vercel.com) e crie uma conta (pode usar sua conta GitHub)
2. Clique em "New Project"
3. Importe o repositório GitHub onde você fez upload dos arquivos
4. Configure as variáveis de ambiente:
   - `MONGODB_URI`: sua string de conexão do MongoDB Atlas (substitua `<password>` pela senha real e adicione `/oftalmocenter` antes do `?`)
   - `JWT_SECRET`: uma string aleatória para segurança (ex: "oftalmocenter-secret-key-123456789")
   - `EMAIL_FROM`: seu email para envio de notificações
   - `EMAIL_SERVER`: servidor SMTP (ex: "smtp.gmail.com")
5. Clique em "Deploy"

## Após o Deploy

1. Acesse a URL fornecida pela Vercel (ex: https://seu-projeto.vercel.app)
2. Adicione `/api/setup` ao final da URL para criar o usuário administrativo inicial
3. Acesse a área administrativa em `/admin` e faça login com:
   - Usuário: admin
   - Senha: admin
4. Altere a senha padrão por segurança
5. Configure as unidades, médicos, planos e horários

## Personalização

- Você pode personalizar as cores e estilos editando o arquivo `styles/globals.css`
- Para alterar a logo, substitua o arquivo `public/img/logo.png`
- Para personalizar as mensagens de confirmação, acesse a área administrativa em "Configurações"

## Suporte

Se precisar de ajuda, entre em contato com o suporte técnico.
