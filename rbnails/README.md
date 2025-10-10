# 💅 RB Nails - Sistema de Agenda e Gestão

> **Versão:** 0.5.0 (Em Desenvolvimento)
> **Stack:** Next.js, TypeScript, MongoDB, Mongoose, NextAuth.js, Material-UI, SWR
> **Objetivo:** Criar um sistema completo para gestão de agendamentos, clientes e finanças para uma esmalteria.

---

## 📖 Visão Geral do Projeto

Este repositório contém o código-fonte de um sistema de gestão para esmalterias. O objetivo é centralizar o controle de agendamentos, o cadastro de clientes e serviços, e fornecer um dashboard com métricas de desempenho para as profissionais e administradores.

---

## ✅ O que já foi feito (Status Atual)

A fundação da aplicação está completa, com as seguintes funcionalidades prontas e testadas:

### 1. Backend e Banco de Dados
- **Conexão Segura com MongoDB:** A aplicação utiliza Mongoose para se conectar a um banco de dados MongoDB Atlas, com credenciais gerenciadas de forma segura via `.env.local`.
- **Modelagem de Dados Robusta:**
  - **`User`**: Gerencia usuários com senhas criptografadas (`bcryptjs`) e um campo `role` ('admin' | 'profissional') para controle de acesso.
  - **`Cliente`**: Cadastro de clientes com validação de telefone único.
  - **`Servico`**: Cadastro de serviços com preço e duração.
  - **`Agendamento`**: Modelo central que relaciona `User`, `Cliente` e `Servico`. Inclui campos virtuais para calcular automaticamente a **taxa do cartão** e o **valor líquido**, simplificando futuros relatórios.
- **API RESTful Completa (CRUD):**
  - `auth`: Endpoints para registro (`/api/auth/register`) e autenticação.
  - `agendamentos`: CRUD completo para gerenciar agendamentos, com suporte a filtros por data.
  - `clientes`: CRUD completo para gerenciar clientes.
  - `servicos`: CRUD completo para gerenciar serviços.
  - `users`: Endpoint para listar usuários (ex: listar apenas profissionais).
  - `dashboard`: Endpoint para buscar estatísticas (`/api/dashboard/stats`).

### 2. Autenticação e Autorização
- **Fluxo de Autenticação Completo:** Sistema de registro e login conectado ao banco de dados usando `NextAuth.js`.
- **Proteção de Rotas:** Componente `AuthGuard` para proteger páginas que exigem login.
- **Gerenciamento de Sessão:** Uso de JWT para gerenciar sessões, incluindo botão de "Sair" funcional.

### 3. Frontend (React com Material-UI e SWR)
- **Agenda Dinâmica:** A página de agenda (`/agenda`) está totalmente conectada ao backend, usando `SWR` para buscar e revalidar dados em tempo real.
- **Modal de Agendamento Inteligente:** O modal para criar/editar agendamentos busca dinamicamente a lista de clientes, serviços e profissionais do banco de dados, usando menus de seleção.
- **Telas de Gerenciamento (CRUD):** Páginas funcionais para listar, criar, editar e excluir **Clientes** e **Serviços**.
- **Dashboard de Desempenho:** O dashboard exibe cards com estatísticas reais (faturamento, atendimentos) e uma lista com os agendamentos do dia para o profissional logado.

---

## 🚀 O que falta fazer (Próximos Passos)

As funcionalidades abaixo são os próximos alvos para evoluir o projeto.

- **[ ] Gerenciamento de Usuários/Profissionais:**
  - Criar uma interface de administrador para listar, criar e editar usuários, permitindo a atribuição da `role` ('admin' ou 'profissional').
  - **[ ] Gerenciamento de Usuários (Admin):**
  - Criar uma interface de administrador para listar e editar usuários existentes.

- **[ ] Refinar Controle de Acesso (Roles):**
  - Proteger as APIs para que apenas usuários com a `role` correta possam executar certas ações (ex: apenas 'admin' pode criar um novo serviço).
  - Ocultar/mostrar elementos da UI com base na `role` do usuário.

- **[ ] Aprimorar o Dashboard:**
  - Adicionar filtros de data (semanal, mensal, personalizado) para visualizar as estatísticas.
  - Incluir uma lista de "Próximos Agendamentos" do dia.
  - Incluir listagem de todos atendimentos

- **[ ] Bloqueio de Horários na Agenda:**
  - Implementar uma funcionalidade para que profissionais possam bloquear horários em suas agendas (folgas, almoço, etc.).
  - Implementar na agenda os horários "comercial" ex: das 8h as 18h.
  
- **[ ] Agenda:**
  - **Modelo de Horários Fixos:** Criar um modelo `Horario` para definir os horários de trabalho padrão de cada profissional( das 7 as 20h).
  - **Modelo de Bloqueios:** Criar um modelo `Bloqueio` para permitir que profissionais bloqueiem horários específicos.
  - **Filtro por Profissional:** Implementar na API e na interface da agenda a capacidade de filtrar os agendamentos por profissional. Por padrão, cada profissional deve bloquear apenas a sua agenda. Profissionais devem ter a opção de ver a agenda de todos.
  - Implementar desmarcar cliente na agenda.
  - No minha agenda optar pelo dia de hoje e semana toda

- implementar desmarcar cliente na agenda.
- no minha agenda optar pelo dia de hoje e semana toda
---

## 💡 Melhorias Potenciais

Ideias para futuras versões do sistema, após a conclusão do roadmap principal.

- **Validação de Formulários no Frontend:** Utilizar bibliotecas como `Formik` e `Yup` para fornecer feedback instantâneo e mais robusto nos formulários de cadastro.
- **Notificações Automáticas:** Integrar um serviço para enviar lembretes de agendamento para clientes via WhatsApp ou E-mail.
- **Página de Relatórios Financeiros:** Criar uma área dedicada para relatórios detalhados, com gráficos e filtros avançados de faturamento por profissional, serviço, etc.
- **Testes Automatizados:** Implementar testes unitários e de integração (`Jest`, `React Testing Library`) para garantir a qualidade e estabilidade do código.
- **Edição de Usuários:** A funcionalidade de registro foi aprimorada para incluir `roles`, mas uma tela de administrador para editar usuários existentes (nome, email, role) seria uma melhoria importante.

---

## 🐞 Rastreamento de Erros

Esta seção será usada para documentar bugs ativos.

- **Atualmente, exite um bug no card do dash ao abrir o card

--------------------