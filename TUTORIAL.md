# Tutorial de Deploy da Plataforma Oftalmocenter

Este tutorial passo a passo vai te guiar no processo de deploy da plataforma de agendamento da Oftalmocenter na Vercel, mesmo sem conhecimentos técnicos de programação.

## Passo 1: Criar uma conta no GitHub

1. Acesse [GitHub.com](https://github.com)
2. Clique em "Sign up" (Cadastrar-se)
3. Siga as instruções para criar sua conta
4. Confirme seu e-mail

## Passo 2: Criar uma conta no MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Clique em "Try Free" (Experimentar Grátis)
3. Preencha o formulário e crie sua conta
4. Confirme seu e-mail

### Configurando o MongoDB Atlas:

1. Após fazer login, clique em "Create" (Criar) para criar um novo projeto
2. Dê um nome ao projeto (ex: "Oftalmocenter") e clique em "Next"
3. Você pode pular o passo de adicionar membros clicando em "Create Project"
4. Na página do projeto, clique em "Build a Database" (Construir um Banco de Dados)
5. Selecione a opção gratuita "Shared" (Compartilhado) e clique em "Create"
6. Escolha um provedor (AWS, Google Cloud ou Azure) e uma região próxima ao Brasil
7. Mantenha as configurações padrão e clique em "Create Cluster"
8. Na seção "Security Quickstart" (Início Rápido de Segurança):
   - Crie um usuário do banco de dados (anote o nome de usuário e senha)
   - Em "Where would you like to connect from" (De onde você gostaria de conectar), selecione "Allow access from anywhere" (Permitir acesso de qualquer lugar)
   - Clique em "Finish and Close" (Finalizar e Fechar)
9. Aguarde a criação do cluster (pode levar alguns minutos)
10. Quando estiver pronto, clique em "Connect" (Conectar)
11. Selecione "Connect your application" (Conectar sua aplicação)
12. No driver, selecione "Node.js" e versão "6.7 or later"
13. Copie a string de conexão (você precisará substituir `<password>` pela senha que você criou)
14. Adicione `/oftalmocenter` após `.net` e antes do `?` na string de conexão

## Passo 3: Criar um repositório no GitHub

1. Faça login no GitHub
2. Clique no botão "+" no canto superior direito e selecione "New repository" (Novo repositório)
3. Dê um nome ao repositório (ex: "oftalmocenter-vercel")
4. Deixe o repositório como "Public" (Público)
5. Não adicione README, .gitignore ou licença
6. Clique em "Create repository" (Criar repositório)

## Passo 4: Fazer upload dos arquivos para o GitHub

1. Na página do seu repositório, clique em "uploading an existing file" (fazer upload de um arquivo existente)
2. Extraia o arquivo ZIP que você recebeu
3. Arraste todos os arquivos e pastas extraídos para a área de upload
4. Clique em "Commit changes" (Confirmar alterações)

## Passo 5: Criar uma conta na Vercel

1. Acesse [Vercel.com](https://vercel.com)
2. Clique em "Sign Up" (Cadastrar-se)
3. Selecione "Continue with GitHub" (Continuar com GitHub)
4. Autorize a Vercel a acessar sua conta do GitHub

## Passo 6: Fazer o deploy na Vercel

1. Na dashboard da Vercel, clique em "Add New..." e selecione "Project" (Projeto)
2. Selecione o repositório "oftalmocenter-vercel" que você criou
3. Na tela de configuração:
   - Mantenha o nome do projeto ou personalize-o
   - Em "Environment Variables" (Variáveis de Ambiente), adicione:
     - Nome: `MONGODB_URI`
       Valor: (cole a string de conexão do MongoDB que você obteve, substituindo `<password>` pela senha real)
     
     - Nome: `JWT_SECRET`
       Valor: `oftalmocenter-secret-key-123456789` (ou qualquer texto longo)
     
     - Nome: `EMAIL_FROM`
       Valor: `seu-email@exemplo.com`
     
     - Nome: `EMAIL_SERVER`
       Valor: `smtp.gmail.com`
4. Clique em "Deploy" (Implantar)
5. Aguarde o processo de deploy (pode levar alguns minutos)

## Passo 7: Configuração inicial da plataforma

1. Quando o deploy for concluído, clique em "Visit" (Visitar) para acessar sua aplicação
2. Adicione `/api/setup` ao final da URL (ex: https://oftalmocenter-vercel.vercel.app/api/setup)
   - Você verá uma mensagem confirmando a criação do usuário administrativo
3. Acesse a área administrativa adicionando `/admin` ao final da URL (ex: https://oftalmocenter-vercel.vercel.app/admin)
4. Faça login com as credenciais padrão:
   - Usuário: admin
   - Senha: admin
5. Altere a senha padrão por segurança
6. Configure as unidades, médicos, planos e horários

## Passo 8: Personalização da plataforma

Na área administrativa, você pode:

1. Cadastrar unidades de atendimento com endereço e foto
2. Cadastrar médicos com foto e especialidade
3. Cadastrar planos de saúde aceitos
4. Configurar horários disponíveis para cada médico
5. Personalizar mensagens de confirmação enviadas por WhatsApp e e-mail
6. Visualizar e gerenciar todos os agendamentos

## Suporte e manutenção

- A plataforma está hospedada na Vercel, que oferece um plano gratuito adequado para o uso inicial
- O banco de dados MongoDB Atlas também oferece um plano gratuito suficiente para começar
- Para suporte técnico ou dúvidas, entre em contato com o desenvolvedor

Parabéns! Sua plataforma de agendamento da Oftalmocenter está online e pronta para uso!
