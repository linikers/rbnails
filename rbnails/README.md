# 💅 RB Nails - Sistema de Agenda e Gestão

> **Versão:** 0.5.0 (Em Desenvolvimento)
> **Stack:** Next.js, TypeScript, MongoDB, Mongoose, NextAuth.js, Material-UI, SWR
> **Versão:** 1.0.0 (Base Funcional Estável)
> **Stack:** Next.js, TypeScript, MongoDB, Mongoose, NextAuth.js, Material-UI, SWR, date-fns
> **Objetivo:** Criar um sistema completo para gestão de agendamentos, clientes e finanças para uma esmalteria.

---

## 📖 Visão Geral do Projeto

Este repositório contém o código-fonte de um sistema de gestão para esmalterias. O objetivo é centralizar o controle de agendamentos, o cadastro de clientes e serviços, e fornecer um dashboard com métricas de desempenho para as profissionais e administradores.
Este projeto é um sistema de gestão completo para esmalterias, desenvolvido para centralizar o controle de agendamentos, o cadastro de clientes e serviços, e fornecer um dashboard com métricas de desempenho para profissionais e administradores. A aplicação é construída com uma arquitetura moderna, focada em performance, escalabilidade e experiência do usuário.

---

## ✅ O que já foi feito (Status Atual)
## ✅ Funcionalidades Implementadas

A fundação da aplicação está completa, com as seguintes funcionalidades prontas e testadas:
A base da aplicação está robusta e funcional, com as seguintes features implementadas e testadas:

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
### 1. Backend & Banco de Dados
- **Conexão Otimizada com MongoDB:** Utiliza Mongoose com um padrão de cache de conexão otimizado para ambientes serverless (Vercel), prevenindo erros de `MissingSchemaError` em produção através do pré-registro de todos os modelos.
- **API Robusta com Validação Detalhada:** A API RESTful retorna mensagens de erro específicas e detalhadas para o frontend. Em caso de falha de validação (ex: tentar agendar no passado), a API envia a mensagem exata do erro, permitindo um feedback claro ao usuário.
- **Modelagem de Dados Abrangente:**
  - **`User`**: Gerencia usuários com senhas criptografadas (`bcryptjs`) e um campo `role` (`'admin'` | `'profissional'`).
  - **`Cliente` & `Servico`**: CRUDs completos para gestão de clientes e serviços.
  - **`Agendamento`**: Modelo central que relaciona `User`, `Cliente` e `Servico`.
  - **`HorarioDisponivel` & `Bloqueio`**: Modelos para definir os horários de trabalho padrão e bloqueios pontuais na agenda de cada profissional.

### 2. Autenticação e Autorização
- **Fluxo de Autenticação Completo:** Sistema de registro e login conectado ao banco de dados usando `NextAuth.js`.
- **Proteção de Rotas:** Componente `AuthGuard` para proteger páginas que exigem login.
- **Gerenciamento de Sessão:** Uso de JWT para gerenciar sessões, incluindo botão de "Sair" funcional.
### 2. Autenticação & Controle de Acesso
- **Autenticação Segura com NextAuth.js:** Fluxo completo de login e registro, com gerenciamento de sessão via JWT.
- **Proteção de Rotas:** O componente `AuthGuard` garante que apenas usuários autenticados possam acessar páginas restritas.
- **Visão por Profissional:** A agenda e o dashboard são automaticamente filtrados para exibir apenas os dados pertencentes ao profissional logado.

### 3. Frontend (React com Material-UI e SWR)
- **Agenda Dinâmica:** A página de agenda (`/agenda`) está totalmente conectada ao backend, usando `SWR` para buscar e revalidar dados em tempo real.
- **Modal de Agendamento Inteligente:** O modal para criar/editar agendamentos busca dinamicamente a lista de clientes, serviços e profissionais do banco de dados, usando menus de seleção.
- **Telas de Gerenciamento (CRUD):** Páginas funcionais para listar, criar, editar e excluir **Clientes** e **Serviços**.
- **Visão por Profissional:** A agenda já filtra e exibe automaticamente apenas os agendamentos do profissional que está logado.
- **Dashboard de Desempenho:** O dashboard exibe cards com estatísticas reais (faturamento, atendimentos) e uma lista com os agendamentos do dia para o profissional logado.
### 3. Frontend & Experiência do Usuário (UX)
- **Sistema de Notificações Globais:** Implementado um `Snackbar` global (Material-UI) usando React Context. Todas as mensagens de sucesso e erro são exibidas de forma não-intrusiva e padronizada, substituindo os `alert()`s nativos.
- **Feedback de Erro Específico:** O sistema agora exibe mensagens de erro claras e úteis. Em vez de um "Erro de validação" genérico, o usuário vê "Não é possível agendar um horário no passado.", melhorando drasticamente a usabilidade.
- **Agenda Inteligente e Reativa:**
  - **Visualização Completa:** A agenda processa e exibe horários de trabalho, bloqueios e agendamentos em uma visão unificada, marcando cada slot como "livre", "agendado" ou "bloqueado".
  - **Busca de Dados em Tempo Real:** Utiliza `SWR` para buscar e revalidar os dados da agenda, garantindo que a informação esteja sempre atualizada.
  - **Modal de Agendamento Dinâmico:** Ao criar um novo agendamento, o modal busca e exibe **apenas os horários disponíveis** para o profissional e o dia selecionados, prevenindo agendamentos duplos.
- **Dashboard de Desempenho:** Exibe cards com estatísticas reais (faturamento, atendimentos) e uma lista com os agendamentos do dia para o profissional logado.
- **Gerenciamento de Horários:** Interface para administradores definirem horários de trabalho e criarem bloqueios na agenda dos profissionais.

- **Gerenciamento de Horários e Bloqueios:**
  - Nova página (`/gerenciarHorarios`) que permite ao administrador definir os horários de trabalho padrão (`HorarioDisponivel`) e criar bloqueios pontuais (`Bloqueio`) para cada profissional.
- **Agenda Inteligente com Bloqueios:**
  - A agenda (`/agenda`) agora integra os horários de trabalho e bloqueios.
  - Exibe visualmente os horários como "agendado", "bloqueado" ou "livre", impedindo novos agendamentos em horários já ocupados ou bloqueados.
---

## 🚀 Roadmap (Próximos Passos)

As funcionalidades abaixo são os próximos alvos para evoluir o projeto.

- **[ ] Criar relatórios financeiros:**
  - Listar todos atendimentos, com valores totais e listagem de serviço e valor por data
  - **[ ] Configurar agenda para horários  agndados utilizarem  o tempo de serviço:**
  - agenda preencher o horario de acordo com o serviço.(ex:  unha 2h - preenche 2h na agenda) 
- **[ ] Refinar Controle de Acesso (Roles):**
  - Proteger endpoints da API para que apenas usuários com a `role` correta possam executar certas ações (ex: apenas `'admin'` pode criar um novo serviço).
  - Ocultar/mostrar elementos da UI (como botões de admin) com base na `role` do usuário logado.

- **[ ] Gerenciamento de Usuários (Admin):**
  - Criar uma interface de administrador para listar, criar e editar usuários, permitindo a atribuição da `role` (`'admin'` ou `'profissional'`).

- **[ ] Aprimorar a Agenda:**
  - **[ ] Visão de Administrador:** Permitir que usuários com a `role` `'admin'` possam visualizar a agenda de todos os profissionais, alternando entre eles com um filtro.
  - **[ ] Cancelar Agendamento:** Implementar a funcionalidade de cancelar um agendamento diretamente pela UI da agenda.

- **[ ] Aprimorar o Dashboard:**
  - **[ ] Filtros de Data:** Adicionar filtros (semanal, mensal, personalizado) para visualizar as estatísticas.
  - **[ ] Listagem Completa:** Incluir uma tabela ou lista com todos os atendimentos do período selecionado.
  - **[ ] "Minha Agenda":** No dashboard, dar a opção de ver os agendamentos da "semana toda", não apenas "hoje".

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

- **[ ] Agenda:**
  - **[ ] Visão de Administrador na Agenda:** Permitir que usuários com a `role` 'admin' possam visualizar a agenda de todos os profissionais, alternando entre eles com um filtro.
  - **[ ] Cancelar Agendamento:** Implementar a funcionalidade de cancelar um agendamento diretamente pela agenda.

- **[ ] Aprimorar o Dashboard:**
  <!-- - Adicionar filtros de data (semanal, mensal, personalizado) para visualizar as estatísticas.
  - Incluir uma lista de "Próximos Agendamentos" do dia.
  - Incluir listagem de todos atendimentos

<!-- - **[ ] Bloqueio de Horários na Agenda:**
  - Implementar uma funcionalidade para que profissionais possam bloquear horários em suas agendas (folgas, almoço, etc.).
  - Implementar na agenda os horários "comercial" ex: das 8h as 18h. -->
  
- **[ ] Agenda:** -->
  <!-- - **Modelo de Horários Fixos:** Criar um modelo `Horario` para definir os horários de trabalho padrão de cada profissional( das 7 as 20h).
  - **Modelo de Bloqueios:** Criar um modelo `Bloqueio` para permitir que profissionais bloqueiem horários específicos. -->
  <!-- - **Filtro por Profissional:** Implementar na API e na interface da agenda a capacidade de filtrar os agendamentos por profissional. Por padrão, cada profissional deve bloquear apenas a sua agenda. Profissionais devem ter a opção de ver a agenda de todos.
  - Implementar desmarcar cliente na agenda.
  - No minha agenda optar pelo dia de hoje e semana toda
<!-- 
- implementar desmarcar cliente na agenda.
- no minha agenda optar pelo dia de hoje e semana toda -->

  - **[ ] Filtros de Data:** Adicionar filtros (semanal, mensal, personalizado) para visualizar as estatísticas.
  - **[ ] Listagem Completa:** Incluir uma tabela ou lista com todos os atendimentos do período selecionado.
  - **[ ] "Minha Agenda":** No dashboard, dar a opção de ver os agendamentos da "semana toda", não apenas "hoje".


## 💡 Melhorias Potenciais

Ideias para futuras versões do sistema, após a conclusão do roadmap principal.

- **Validação de Formulários no Frontend:** Utilizar bibliotecas como `Formik` e `Yup` para fornecer feedback instantâneo e mais robusto nos formulários de cadastro.
- **Validação de Formulários no Frontend:** Utilizar bibliotecas como `react-hook-form` com `yup` para fornecer feedback de validação instantâneo e inline nos campos dos formulários.
- **Notificações Automáticas:** Integrar um serviço para enviar lembretes de agendamento para clientes via WhatsApp ou E-mail.
- **Página de Relatórios Financeiros:** Criar uma área dedicada para relatórios detalhados, com gráficos e filtros avançados de faturamento por profissional, serviço, etc.
- **Testes Automatizados:** Implementar testes unitários e de integração (`Jest`, `React Testing Library`) para garantir a qualidade e estabilidade do código.
- **Edição de Usuários:** A funcionalidade de registro foi aprimorada para incluir `roles`, mas uma tela de administrador para editar usuários existentes (nome, email, role) seria uma melhoria importante.

---

## 🐞 Rastreamento de Erros
## 🐞 Bugs Conhecidos

Esta seção será usada para documentar bugs ativos.

<!-- - **Atualmente, exite um bug no card do dash ao abrir o card -->

- **Bug no Card do Dashboard:** Ao clicar no card de um agendamento na seção "Minha Agenda de Hoje" do dashboard, a ação de edição não é acionada.
- **[ ] Bug no Card do Dashboard:** Ao clicar no card de um agendamento na seção "Minha Agenda de Hoje" do dashboard, a ação de edição não é acionada.

--------------------
as maquinas perderam a alma, perderam a essencia as vibraçoes e intervalos

