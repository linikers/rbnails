
# 💅 RB Nails - Sistema de Agenda e Gestão

> **Versão:** 1.0.0 (Base Funcional Estável)
> **Stack:** Next.js, TypeScript, MongoDB, Mongoose, NextAuth.js, Material-UI, SWR, date-fns

---

## 📖 Visão Geral do Projeto

Este projeto é um sistema de gestão completo para esmalterias, desenvolvido para centralizar o controle de agendamentos, o cadastro de clientes e serviços, e fornecer um dashboard com métricas de desempenho para profissionais e administradores. A aplicação é construída com uma arquitetura moderna, focada em performance, escalabilidade e experiência do usuário.

---

## 🗺️ Estrutura do Projeto

Para facilitar a navegação e manutenção, o projeto está organizado da seguinte forma:

-   `pages/api/`: Contém toda a lógica de backend (API RESTful). Cada arquivo corresponde a um recurso (ex: `/api/agendamentos`, `/api/clientes`). A autenticação é gerenciada em `/api/auth/`.
-   `models/`: Define os schemas do Mongoose para o MongoDB (ex: `User.js`, `Agendamento.js`), que representam a estrutura dos dados no banco.
-   `lib/`: Armazena código de suporte, como a lógica de conexão com o banco de dados (`mongodb.js`) e outras funções utilitárias.
-   `components/`: Abriga os componentes React reutilizáveis, como o `AuthGuard.js` para proteção de rotas, modais de agendamento e elementos de UI.
-   `contexts/`: Gerencia estados globais da aplicação usando a Context API do React, como o `SnackbarContext.js` para exibir notificações.
-   `pages/`: Representa as páginas da aplicação que os usuários acessam no navegador. Por exemplo, `/agenda` é a página principal da agenda e `/dashboard` é o painel de desempenho.

---

## ✅ Funcionalidades Implementadas

A base da aplicação está robusta e funcional, com as seguintes features implementadas e testadas:

### 1. Backend & Banco de Dados (`pages/api/`, `models/`, `lib/`)
- **Conexão Otimizada com MongoDB:** Utiliza Mongoose com um padrão de cache de conexão otimizado para ambientes serverless (Vercel), prevenindo erros de `MissingSchemaError` em produção através do pré-registro de todos os modelos.
- **API Robusta com Validação Detalhada:** A API RESTful retorna mensagens de erro específicas e detalhadas para o frontend. Em caso de falha de validação (ex: tentar agendar no passado), a API envia a mensagem exata do erro, permitindo um feedback claro ao usuário.
- **Modelagem de Dados Abrangente:**
  - **`User`**: Gerencia usuários com senhas criptografadas (`bcryptjs`) e um campo `role` (`'admin'` | `'profissional'`).
  - **`Cliente` & `Servico`**: CRUDs completos para gestão de clientes e serviços.
  - **`Agendamento`**: Modelo central que relaciona `User`, `Cliente` e `Servico`.
  - **`HorarioDisponivel` & `Bloqueio`**: Modelos para definir os horários de trabalho padrão e bloqueios pontuais na agenda de cada profissional.

### 2. Autenticação & Controle de Acesso (`pages/api/auth/`, `components/AuthGuard.js`)
- **Autenticação Segura com NextAuth.js:** Fluxo completo de login e registro, com gerenciamento de sessão via JWT.
- **Proteção de Rotas:** O componente `AuthGuard` garante que apenas usuários autenticados possam acessar páginas restritas.
- **Visão por Profissional:** A agenda e o dashboard são automaticamente filtrados para exibir apenas os dados pertencentes ao profissional logado.

### 3. Frontend & Experiência do Usuário (UX) (`pages/`, `components/`, `contexts/`)
- **Sistema de Notificações Globais:** Implementado um `Snackbar` global (Material-UI) usando React Context. Todas as mensagens de sucesso e erro são exibidas de forma não-intrusiva e padronizada, substituindo os `alert()`s nativos.
- **Feedback de Erro Específico:** O sistema agora exibe mensagens de erro claras e úteis. Em vez de um "Erro de validação" genérico, o usuário vê "Não é possível agendar um horário no passado.", melhorando drasticamente a usabilidade.
- **Agenda Inteligente e Reativa:**
  - **Visualização Completa:** A agenda processa e exibe horários de trabalho, bloqueios e agendamentos em uma visão unificada, marcando cada slot como "livre", "agendado" ou "bloqueado".
  - **Busca de Dados em Tempo Real:** Utiliza `SWR` para buscar e revalidar os dados da agenda, garantindo que a informação esteja sempre atualizada.
  - **Modal de Agendamento Dinâmico:** Ao criar um novo agendamento, o modal busca e exibe **apenas os horários disponíveis** para o profissional e o dia selecionados, prevenindo agendamentos duplos.
- **Dashboard de Desempenho (`pages/dashboard.js`):** Exibe cards com estatísticas reais (faturamento, atendimentos) e uma lista com os agendamentos do dia para o profissional logado.
- **Gerenciamento de Horários (`pages/gerenciarHorarios.js`):** Interface para administradores definirem horários de trabalho e criarem bloqueios na agenda dos profissionais.
---

## 🚀 Roadmap (Próximos Passos)

As funcionalidades abaixo são os próximos alvos para evoluir o projeto.

- **[ ] Relatórios Financeiros:**
  - Criar uma página para listar todos os atendimentos por período, com valores totais e detalhes de cada serviço.
- **[ ] Melhorias na Agenda:**
  - **[ ] Duração do Serviço:** Fazer com que a agenda bloqueie automaticamente o tempo correto de acordo com a duração do serviço selecionado (ex: um serviço de 2h deve ocupar dois slots de 1h).
  - **[ ] Visão de Administrador:** Permitir que usuários `admin` visualizem a agenda de todos os profissionais, com um filtro para alternar entre eles.
  - **[ ] Cancelar Agendamento:** Implementar a funcionalidade para cancelar um agendamento diretamente pela UI.
- **[ ] Controle de Acesso (Roles):**
  - Proteger endpoints da API para que apenas `admin` possa executar ações críticas (ex: criar um novo serviço).
  - Ocultar/mostrar elementos da UI (como botões de admin) com base na `role` do usuário.
- **[ ] Gerenciamento de Usuários (Admin):**
  - Criar uma interface de administrador para listar, criar e editar usuários, permitindo a atribuição de `role`.
- **[ ] Melhorias no Dashboard:**
  - **[ ] Filtros de Data:** Adicionar filtros (semanal, mensal, personalizado) para visualizar as estatísticas.
  - **[ ] Listagem Completa:** Incluir uma tabela ou lista com todos os atendimentos do período selecionado.
  - **[ ] "Minha Agenda":** No dashboard, dar a opção de ver os agendamentos da "semana toda", não apenas "hoje".

## 💡 Melhorias Potenciais

Ideias para futuras versões do sistema, após a conclusão do roadmap principal.

- **Validação de Formulários no Frontend:** Utilizar bibliotecas como `react-hook-form` com `yup` para fornecer feedback de validação instantâneo e inline nos campos dos formulários.
- **Notificações Automáticas:** Integrar um serviço para enviar lembretes de agendamento para clientes via WhatsApp ou E-mail.
- **Página de Relatórios Financeiros:** Criar uma área dedicada para relatórios detalhados, com gráficos e filtros avançados de faturamento por profissional, serviço, etc.
- **Testes Automatizados:** Implementar testes unitários e de integração (`Jest`, `React Testing Library`) para garantir a qualidade e estabilidade do código.

---

## 🐞 Bugs Conhecidos

- **[ ] Bug no Card do Dashboard:** Ao clicar no card de um agendamento na seção "Minha Agenda de Hoje" do dashboard, a ação de edição não é acionada.
