# 📘 Banco de Dados — Agenda Esmalteria (MongoDB)

> **Versão:** 1.0  
> **Banco:** MongoDB  
> **Objetivo:** Estruturar base de dados para sistema de agendamento multiusuário (esmalteria)  
> **Autor:** Liniker Santos  
> **Data:** 07/10/2025

---

## 1. Visão Geral

O sistema é uma **agenda digital multiusuário**, com:

- **4 profissionais (manicures)** e **1 administrador**
- **Serviços dinâmicos** (não fixos)
- **Agendamento de horários**
- **Bloqueio de horários** (folgas, feriados, imprevistos)
- **Controle de status** (`pendente`, `confirmado`, `cancelado`)
- **Interface de agenda visual (front-end)**

O banco de dados MongoDB armazenará usuários, clientes, serviços, agendamentos e bloqueios.

---

## 2. Ambiente e Inicialização

### 2.1. Pré-requisitos
- Node.js (>= 18)
- MongoDB local (ou Atlas, futuramente)
- MongoDB Compass (GUI opcional)

### 2.2. Criar banco e usuário

Abra o terminal do Mongo:

```bash
mongosh


# 💅 RB Nails - Sistema de Agenda e Gestão

> **Versão:** 0.2.0 (Em Desenvolvimento)
> **Stack:** Next.js, TypeScript, MongoDB, Mongoose, NextAuth.js, Material-UI
> **Objetivo:** Criar um sistema completo para gestão de agendamentos, clientes e finanças para uma esmalteria.

---

## ✅ O que já foi feito (Status Atual)

Nesta fase, construímos a fundação robusta e segura da aplicação, focando na estrutura do banco de dados e na autenticação dos usuários.

### 1. Backend e Banco de Dados (MongoDB + Mongoose)
- **Conexão Segura:** A aplicação está conectada a um banco de dados MongoDB Atlas, com as credenciais gerenciadas de forma segura através de variáveis de ambiente (`.env.local`).

- **API CRUD Completa:** A API de agendamentos agora suporta todas as operações: `GET` (com filtros de data), `POST`, `PUT` e `DELETE`.

- **Modelagem de Dados:** Foram criados `Schemas` com Mongoose para todas as entidades principais do negócio, garantindo a integridade e padronização dos dados:
  - **`User`**: Para gestão de usuários, com senhas criptografadas (`bcryptjs`) e validação de campos únicos.
  - **`Cliente`**: Para o cadastro de clientes.
  - **`Servico`**: Para o cadastro de serviços com preço e duração.
  - **`Profissional`**: Para o cadastro das profissionais.
  - **`Agendamento`**: Modelo central que relaciona as outras entidades e inclui lógica de negócio avançada, como campos virtuais para calcular automaticamente a **taxa do cartão** e o **valor líquido** a receber, facilitando futuros relatórios financeiros.

### 2. Autenticação e Autorização (NextAuth.js)
- **Fluxo Completo de Usuário:** Implementamos um sistema de autenticação completo:
  - **Página de Registro (`/auth/register`):** Permite que novos usuários criem uma conta, que é salva de forma segura no MongoDB.
  - **Página de Login (`/auth/login`):** Autentica os usuários comparando as credenciais com os dados do banco de dados.
  - **Proteção de Rotas:** A página `/dashboard` está protegida, sendo acessível apenas por usuários autenticados.
  - **Gestão de Sessão:** O dashboard agora inclui um botão "Sair" e foi corrigido para não exibir dados de sessões antigas ("cache").

### 3. API
- **Endpoints Funcionais:** Foram criados os endpoints de API essenciais:
  - `POST /api/auth/register`: Cria novos usuários.
  - `GET /api/agendamentos`: Busca agendamentos, com suporte a filtros por data.
  - `POST /api/agendamentos`: Cria um novo agendamento.
  - `GET /api/agendamentos/[id]`: Busca um agendamento específico.
  - `PUT /api/agendamentos/[id]`: Atualiza um agendamento específico.
  - `DELETE /api/agendamentos/[id]`: Deleta um agendamento específico.

### 4. Frontend da Agenda
- **Agenda Conectada ao Banco:** A página de agenda (`/agenda`) foi refatorada para abandonar o `localStorage` e consumir a API em tempo real, utilizando `SWR` para uma experiência de usuário fluida e com atualizações otimistas.


---

## 🐞 Erros Conhecidos (Bugs)

- **Erro de Tipo em `clientes.tsx`:** Ao deletar um cliente, o TypeScript pode apontar um erro de tipo no `_id`. Isso foi corrigido ao tipar explicitamente o `_id` como `string` na interface `ICliente`.

- **Erro ao Salvar/Editar Agendamento:** Ao tentar salvar um novo agendamento na página `/agenda`, ocorre um erro no frontend (relacionado à função `toISOString` na linha 216). Isso acontece porque os dados vindos do modal (especialmente `slotDataFromModal.hora`) não estão sendo recebidos corretamente, resultando na criação de uma data inválida. A correção será feita após a implementação das telas de gerenciamento, pois o modal precisa ser refatorado para usar dados reais (clientes, serviços, etc.).

---

## 🚀 O que falta fazer (Próximos Passos)

Com a base sólida pronta, o foco agora é construir as funcionalidades que o usuário final irá interagir no dia a dia. A próxima etapa é criar a tela de gerenciamento de **Profissionais**.

### 1. Criar as Telas de Gerenciamento (CRUD)
- Para que o sistema seja útil, é preciso criar interfaces para gerenciar os dados principais:
  - **[FEITO]** Página de Clientes.
  - **[FEITO]** Página de Serviços.
  - **Página de Profissionais:** Uma tela para gerenciar as profissionais da esmalteria.


### 2. Aprimorar o Modal de Agendamento (Prioridade Máxima)
- O modal de agendamento (`AddEditModal`) precisa ser atualizado para refletir o novo modelo de dados:
  - Usar menus suspensos (`<select>`) para escolher um **Cliente**, um **Serviço** e uma **Profissional** a partir dos dados já cadastrados no banco. Isso garante que o agendamento seja salvo com as referências corretas (`ObjectId`).

### 3. Implementar o Dashboard
- O componente `DashboardCards` precisa ser desenvolvido para exibir informações úteis e em tempo real, como:
  - Agendamentos do dia.
  - Faturamento da semana.
  - Gráficos simples de desempenho.

### 4. Refinar a Autorização (Controle de Acesso)
- Adicionar um campo `role` (ex: "admin", "profissional") ao modelo `User`.
- **Decisão de Arquitetura:** A entidade "Profissional" não terá um modelo separado. Em vez disso, os usuários com a `role` de "profissional" serão listados como profissionais disponíveis para agendamento. Isso centraliza a gestão de pessoas e logins.
- Limitar o acesso a certas funcionalidades com base no papel do usuário (ex: apenas um "admin" pode cadastrar novos serviços).
