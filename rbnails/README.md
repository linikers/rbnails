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


