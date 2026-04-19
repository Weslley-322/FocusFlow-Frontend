# 📚 FocusFlow — Plataforma Integrada de Estudos

FocusFlow é uma plataforma web completa voltada para otimização dos estudos, combinando técnicas consagradas de produtividade e memorização em uma única interface. Desenvolvido como Trabalho de Conclusão de Curso (TCC) em Desenvolvimento de Sistemas.

🔗 **[Acessar o FocusFlow](https://focus-flow-frontend-dusky.vercel.app)** · **[Repositório do Backend](https://github.com/Weslley-322/FocusFlow-Backend)**

---

## ✨ Funcionalidades

- **Pomodoro Timer** — Temporizador com ciclos de foco e pausa configuráveis, contador de sessões e barra de progresso circular
- **Flashcards com SM-2** — Sistema de revisão espaçada baseado no algoritmo SM-2, com agendamento automático das revisões por nível de dificuldade
- **Mapas Mentais** — Editor interativo de mapas mentais com nós arrastáveis, conexões manuais, paleta de cores e edição inline
- **Metas de Estudo** — Criação e acompanhamento de metas com progresso animado e mensagens motivacionais
- **Gerenciamento de Matérias e Tópicos** — Organização hierárquica do conteúdo estudado
- **Autenticação completa** — Cadastro, login com JWT e verificação de e-mail
- **Modo escuro** — Suporte completo a dark mode em todos os componentes

---

## 🧪 Conta Demo

Para explorar o sistema sem precisar criar uma conta:

| Campo | Valor |
|-------|-------|
| E-mail | demofocusflow12@gmail.com |
| Senha | 12345yt67 |

---

## 🛠️ Tecnologias

- **React + TypeScript** — Base da interface
- **Vite** — Bundler e servidor de desenvolvimento
- **Tailwind CSS** — Estilização utilitária
- **Zustand** — Gerenciamento de estado global
- **React Flow** — Editor de mapas mentais
- **Axios** — Comunicação com a API

---

## 🚀 Rodando localmente

### Pré-requisitos

- Node.js 18+
- Backend do FocusFlow rodando localmente

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/Weslley-322/FocusFlow-Frontend.git

# 2. Instale as dependências
cd FocusFlow-Frontend
npm install
```

### Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

### Executando

```bash
npm run dev
```

O frontend iniciará na porta `3001` por padrão.

---

## 🌐 Infraestrutura de produção

| Camada | Serviço |
|--------|---------|
| Frontend | Vercel |
| Backend | Render |
| Banco de dados | TiDB Cloud Serverless |

---

## 👨‍💻 Autor

Desenvolvido por **Weslley** como TCC do curso de Desenvolvimento de Sistemas.
