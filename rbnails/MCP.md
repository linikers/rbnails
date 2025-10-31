Guia Completo: MCP para Atendimento e Agendamento via WhatsApp
📋 Visão Geral
Este guia detalha como criar um servidor MCP (Model Context Protocol) para atendimento automatizado e agendamento via WhatsApp, deployado na Vercel usando TypeScript, Node.js e React.
🏗️ Arquitetura do Sistema
WhatsApp Business API
         ↓
    Webhook (Vercel)
         ↓
    MCP Server (Tools)
         ↓
  ┌──────┴──────┐
  ↓             ↓
Sistema de    Database
Agendamento   (Postgres)
📦 Stack Tecnológica

Backend: Node.js + TypeScript
Frontend: React (dashboard opcional)
Deploy: Vercel
Database: Vercel Postgres ou Supabase
WhatsApp: Meta WhatsApp Business API ou Evolution API
MCP SDK: @modelcontextprotocol/sdk


🚀 Parte 1: Configuração Inicial
1.1 Criar Projeto
bash# Criar projeto Next.js com TypeScript
npx create-next-app@latest mcp-whatsapp-scheduler --typescript --tailwind --app

cd mcp-whatsapp-scheduler

# Instalar dependências
npm install @modelcontextprotocol/sdk
npm install axios zod date-fns
npm install @vercel/postgres
npm install -D @types/node
1.2 Estrutura de Pastas
mcp-whatsapp-scheduler/
├── app/
│   ├── api/
│   │   ├── webhook/
│   │   │   └── route.ts          # Recebe mensagens do WhatsApp
│   │   ├── mcp/
│   │   │   └── route.ts          # Endpoint MCP via HTTP
│   │   └── schedule/
│   │       └── route.ts          # Gerencia agendamentos
│   └── page.tsx                  # Dashboard (opcional)
├── lib/
│   ├── mcp/
│   │   ├── server.ts             # MCP Server
│   │   └── tools.ts              # Ferramentas MCP
│   ├── whatsapp/
│   │   ├── client.ts             # Cliente WhatsApp
│   │   └── handler.ts            # Processa mensagens
│   ├── scheduling/
│   │   ├── system.ts             # Integração com sistema de agenda
│   │   └── types.ts              # Tipos de agendamento
│   └── db/
│       └── client.ts             # Cliente database
└── .env.local
1.3 Variáveis de Ambiente (.env.local)
env# WhatsApp Business API
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_ACCESS_TOKEN=seu_token
WHATSAPP_VERIFY_TOKEN=seu_verify_token_customizado

# Sistema de Agendamento (exemplo)
SCHEDULING_API_URL=https://api.seu-sistema.com
SCHEDULING_API_KEY=sua_chave_api

# Database
POSTGRES_URL=sua_connection_string

# MCP
MCP_SECRET=seu_secret_para_autenticacao

🔧 Parte 2: Implementação do MCP Server
2.1 Tipos e Schemas (lib/scheduling/types.ts)
typescriptimport { z } from 'zod';

// Schema de validação para agendamento
export const AppointmentSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  serviceType: z.enum(['consulta', 'exame', 'retorno', 'procedimento']),
  date: z.string().datetime(),
  duration: z.number().min(15).max(240), // em minutos
  notes: z.string().optional(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

// Schema para disponibilidade
export const AvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceType: z.string(),
});

export type AvailabilityQuery = z.infer<typeof AvailabilitySchema>;

// Tipos de resposta
export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface SchedulingSystemResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
2.2 Cliente do Sistema de Agendamento (lib/scheduling/system.ts)
typescriptimport axios, { AxiosInstance } from 'axios';
import { Appointment, AvailabilityQuery, TimeSlot, SchedulingSystemResponse } from './types';

export class SchedulingSystemClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.SCHEDULING_API_URL,
      headers: {
        'Authorization': `Bearer ${process.env.SCHEDULING_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Interceptor para logging
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Scheduling API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Busca horários disponíveis
   * 
   * Endpoint esperado: GET /api/availability
   * Query params: date, serviceType
   * 
   * Resposta esperada:
   * {
   *   "date": "2025-11-15",
   *   "slots": [
   *     { "startTime": "09:00", "endTime": "09:30", "available": true },
   *     { "startTime": "09:30", "endTime": "10:00", "available": false }
   *   ]
   * }
   */
  async getAvailability(query: AvailabilityQuery): Promise<TimeSlot[]> {
    try {
      const response = await this.client.get('/api/availability', {
        params: {
          date: query.date,
          service_type: query.serviceType,
        },
      });

      // Adaptar resposta do seu sistema para o formato padrão
      return this.normalizeTimeSlots(response.data);
    } catch (error) {
      throw new Error(`Erro ao buscar disponibilidade: ${error.message}`);
    }
  }

  /**
   * Cria um novo agendamento
   * 
   * Endpoint esperado: POST /api/appointments
   * Body: appointment data
   * 
   * Resposta esperada:
   * {
   *   "success": true,
   *   "appointmentId": "abc123",
   *   "confirmationCode": "CONF-12345"
   * }
   */
  async createAppointment(appointment: Appointment): Promise<SchedulingSystemResponse> {
    try {
      const response = await this.client.post('/api/appointments', {
        customer: {
          name: appointment.customerName,
          phone: appointment.customerPhone,
        },
        service_type: appointment.serviceType,
        scheduled_at: appointment.date,
        duration_minutes: appointment.duration,
        notes: appointment.notes,
      });

      return {
        success: true,
        data: response.data,
        message: `Agendamento confirmado! Código: ${response.data.confirmationCode}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Cancela um agendamento
   * 
   * Endpoint esperado: DELETE /api/appointments/:id
   * ou POST /api/appointments/:id/cancel
   */
  async cancelAppointment(appointmentId: string, reason?: string): Promise<SchedulingSystemResponse> {
    try {
      const response = await this.client.post(`/api/appointments/${appointmentId}/cancel`, {
        reason,
        cancelled_by: 'customer',
      });

      return {
        success: true,
        message: 'Agendamento cancelado com sucesso',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Resgata agendamento por telefone
   * 
   * Endpoint esperado: GET /api/appointments
   * Query params: phone
   */
  async getAppointmentsByPhone(phone: string): Promise<Appointment[]> {
    try {
      const response = await this.client.get('/api/appointments', {
        params: { phone },
      });

      return this.normalizeAppointments(response.data.appointments || []);
    } catch (error) {
      throw new Error(`Erro ao buscar agendamentos: ${error.message}`);
    }
  }

  /**
   * Reagenda um compromisso existente
   */
  async rescheduleAppointment(
    appointmentId: string,
    newDate: string
  ): Promise<SchedulingSystemResponse> {
    try {
      const response = await this.client.patch(`/api/appointments/${appointmentId}`, {
        scheduled_at: newDate,
      });

      return {
        success: true,
        message: 'Agendamento remarcado com sucesso',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Métodos auxiliares para normalizar dados

  private normalizeTimeSlots(apiResponse: any): TimeSlot[] {
    // Adapte conforme o formato da SUA API
    if (Array.isArray(apiResponse.slots)) {
      return apiResponse.slots.map((slot: any) => ({
        startTime: slot.startTime || slot.start_time,
        endTime: slot.endTime || slot.end_time,
        available: slot.available ?? true,
      }));
    }
    return [];
  }

  private normalizeAppointments(apiAppointments: any[]): Appointment[] {
    return apiAppointments.map((apt: any) => ({
      customerName: apt.customer?.name || apt.customer_name,
      customerPhone: apt.customer?.phone || apt.customer_phone,
      serviceType: apt.service_type || apt.serviceType,
      date: apt.scheduled_at || apt.date,
      duration: apt.duration_minutes || apt.duration || 30,
      notes: apt.notes,
    }));
  }
}

// Singleton instance
export const schedulingSystem = new SchedulingSystemClient();
2.3 Ferramentas MCP (lib/mcp/tools.ts)
typescriptimport { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { schedulingSystem } from '../scheduling/system';
import { AppointmentSchema, AvailabilitySchema } from '../scheduling/types';
import { format, parse, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function registerSchedulingTools(server: McpServer) {
  
  // Tool 1: Verificar disponibilidade
  server.tool(
    'check_availability',
    'Verifica horários disponíveis para agendamento em uma data específica',
    {
      date: z.string().describe('Data no formato YYYY-MM-DD'),
      serviceType: z.string().describe('Tipo de serviço: consulta, exame, retorno, procedimento'),
    },
    async ({ date, serviceType }) => {
      try {
        const slots = await schedulingSystem.getAvailability({ date, serviceType });
        
        const availableSlots = slots.filter(s => s.available);
        
        if (availableSlots.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `Não há horários disponíveis para ${serviceType} no dia ${format(parse(date, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR })}.`,
              },
            ],
          };
        }

        const slotsList = availableSlots
          .map(s => `• ${s.startTime} às ${s.endTime}`)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `Horários disponíveis para ${serviceType} em ${format(parse(date, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR })}:\n\n${slotsList}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro ao verificar disponibilidade: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool 2: Criar agendamento
  server.tool(
    'create_appointment',
    'Cria um novo agendamento para o cliente',
    {
      customerName: z.string().describe('Nome completo do cliente'),
      customerPhone: z.string().describe('Telefone do cliente com código do país'),
      serviceType: z.enum(['consulta', 'exame', 'retorno', 'procedimento']).describe('Tipo de serviço'),
      date: z.string().describe('Data e hora no formato ISO 8601 (YYYY-MM-DDTHH:mm:ss)'),
      duration: z.number().optional().describe('Duração em minutos (padrão: 30)'),
      notes: z.string().optional().describe('Observações adicionais'),
    },
    async (params) => {
      try {
        // Validar dados
        const appointment = AppointmentSchema.parse({
          ...params,
          duration: params.duration || 30,
        });

        // Criar agendamento
        const result = await schedulingSystem.createAppointment(appointment);

        if (!result.success) {
          return {
            content: [
              {
                type: 'text',
                text: `Não foi possível criar o agendamento: ${result.error}`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: result.message || 'Agendamento criado com sucesso!',
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro ao criar agendamento: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool 3: Listar agendamentos do cliente
  server.tool(
    'list_customer_appointments',
    'Lista todos os agendamentos de um cliente pelo telefone',
    {
      phone: z.string().describe('Telefone do cliente'),
    },
    async ({ phone }) => {
      try {
        const appointments = await schedulingSystem.getAppointmentsByPhone(phone);

        if (appointments.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'Nenhum agendamento encontrado para este telefone.',
              },
            ],
          };
        }

        const appointmentsList = appointments
          .map((apt, index) => {
            const dateFormatted = format(
              new Date(apt.date),
              "dd/MM/yyyy 'às' HH:mm",
              { locale: ptBR }
            );
            return `${index + 1}. ${apt.serviceType} - ${dateFormatted}`;
          })
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `Agendamentos encontrados:\n\n${appointmentsList}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro ao buscar agendamentos: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool 4: Cancelar agendamento
  server.tool(
    'cancel_appointment',
    'Cancela um agendamento existente',
    {
      appointmentId: z.string().describe('ID do agendamento a ser cancelado'),
      reason: z.string().optional().describe('Motivo do cancelamento'),
    },
    async ({ appointmentId, reason }) => {
      try {
        const result = await schedulingSystem.cancelAppointment(appointmentId, reason);

        return {
          content: [
            {
              type: 'text',
              text: result.success
                ? result.message!
                : `Erro ao cancelar: ${result.error}`,
            },
          ],
          isError: !result.success,
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro ao cancelar agendamento: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool 5: Reagendar
  server.tool(
    'reschedule_appointment',
    'Remarca um agendamento existente para uma nova data/hora',
    {
      appointmentId: z.string().describe('ID do agendamento'),
      newDate: z.string().describe('Nova data e hora no formato ISO 8601'),
    },
    async ({ appointmentId, newDate }) => {
      try {
        const result = await schedulingSystem.rescheduleAppointment(appointmentId, newDate);

        return {
          content: [
            {
              type: 'text',
              text: result.success
                ? result.message!
                : `Erro ao reagendar: ${result.error}`,
            },
          ],
          isError: !result.success,
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro ao reagendar: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}

📱 Parte 3: Integração com WhatsApp
3.1 Cliente WhatsApp (lib/whatsapp/client.ts)
typescriptimport axios, { AxiosInstance } from 'axios';

export class WhatsAppClient {
  private client: AxiosInstance;
  private phoneNumberId: string;

  constructor() {
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
    this.client = axios.create({
      baseURL: process.env.WHATSAPP_API_URL,
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(to: string, message: string) {
    try {
      const response = await this.client.post(
        `/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async markAsRead(messageId: string) {
    try {
      await this.client.post(`/${this.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }
}

export const whatsappClient = new WhatsAppClient();
3.2 Webhook do WhatsApp (app/api/webhook/route.ts)
typescriptimport { NextRequest, NextResponse } from 'next/server';
import { whatsappClient } from '@/lib/whatsapp/client';

// Verificação do webhook (Meta exige isso)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// Receber mensagens
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extrair mensagem
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message) {
      return NextResponse.json({ status: 'no message' });
    }

    const from = message.from;
    const messageId = message.id;
    const messageText = message.text?.body;

    // Marcar como lida
    await whatsappClient.markAsRead(messageId);

    // Processar mensagem com MCP
    // Aqui você chamaria o MCP server para processar a mensagem
    // e gerar uma resposta inteligente
    
    // Por enquanto, resposta simples:
    await whatsappClient.sendMessage(
      from,
      'Olá! Recebi sua mensagem. Como posso ajudar com seu agendamento?'
    );

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

🔗 Parte 4: Integração Completa MCP + WhatsApp
4.1 Handler de Mensagens (lib/whatsapp/handler.ts)
typescriptimport { whatsappClient } from './client';
// Aqui você integraria com o MCP server
// Por exemplo, usando o SDK do Claude ou outra LLM

export async function handleIncomingMessage(from: string, message: string) {
  try {
    // 1. Processar mensagem com contexto
    // 2. MCP tools estarão disponíveis para a LLM
    // 3. LLM decide quais tools usar
    // 4. Retornar resposta formatada

    // Exemplo simplificado:
    const response = await processWithMCP(message, from);
    
    // Enviar resposta
    await whatsappClient.sendMessage(from, response);
  } catch (error) {
    console.error('Error handling message:', error);
    await whatsappClient.sendMessage(
      from,
      'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.'
    );
  }
}

async function processWithMCP(message: string, customerPhone: string): Promise<string> {
  // Aqui você integraria com Claude API ou outra LLM
  // passando as tools MCP disponíveis
  
  // Pseudocódigo:
  // const response = await claude.messages.create({
  //   model: 'claude-4-sonnet',
  //   messages: [{ role: 'user', content: message }],
  //   tools: mcpTools, // Tools registradas no MCP
  // });
  
  return 'Resposta processada pelo MCP';
}

🗄️ Parte 5: Database (Opcional para Cache)
typescript// lib/db/client.ts
import { sql } from '@vercel/postgres';

export async function saveConversation(phone: string, message: string, sender: 'user' | 'bot') {
  await sql`
    INSERT INTO conversations (phone, message, sender, created_at)
    VALUES (${phone}, ${message}, ${sender}, NOW())
  `;
}

export async function getConversationHistory(phone: string, limit = 10) {
  const { rows } = await sql`
    SELECT * FROM conversations
    WHERE phone = ${phone}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows;
}

🚀 Parte 6: Deploy na Vercel
6.1 Configurar vercel.json
json{
  "functions": {
    "app/api/webhook/route.ts": {
      "maxDuration": 10
    }
  },
  "env": {
    "WHATSAPP_API_URL": "@whatsapp-api-url",
    "WHATSAPP_PHONE_NUMBER_ID": "@whatsapp-phone-id",
    "WHATSAPP_ACCESS_TOKEN": "@whatsapp-token",
    "WHATSAPP_VERIFY_TOKEN": "@whatsapp-verify-token",
    "SCHEDULING_API_URL": "@scheduling-api-url",
    "SCHEDULING_API_KEY": "@scheduling-api-key"
  }
}
6.2 Deploy
bash# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
6.3 Configurar Webhook no Meta

Acesse Meta for Developers
Vá em WhatsApp > Configuration
Adicione webhook URL: https://seu-app.vercel.app/api/webhook
Adicione o verify token configurado
Subscribe nos eventos: messages


📊 Parte 7: Tratamento de Erros e Casos Especiais
7.1 Rate Limiting
typescript// lib/rate-limit.ts
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(phone: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const userRequests = rateLimitMap.get(phone) || [];
  
  // Remover requests antigas
  const validRequests = userRequests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false; // Rate limit excedido
  }
  
  validRequests.push(now);
  rateLimitMap.set(phone, validRequests);
  return true;
}
7.2 Retry Logic para API do Sistema
typescriptasync function retryRequest<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
}

🧪 Parte 8: Testes
8.1 Testar Webhook Localmente
bash# Instalar ngrok
npm install -g ngrok

# Expor localhost
ngrok http 3000

# Usar URL do ngrok no Meta Webhook
8.2 Testar Tools MCP
typescript// test/mcp-tools.test.ts
import { schedulingSystem } from '../lib/scheduling/system';

async function testAvailability() {
  const slots = await schedulingSystem.getAvailability({
    date: '2025-11-15',
    serviceType: 'consulta',
  });
  console.log('Disponibilidade:', slots);
}

testAvailability();

📝 Checklist de Implementação

 Configurar projeto Next.js com TypeScript
 Instalar dependências do MCP SDK
 Criar tipos e schemas de validação
 Implementar cliente do sistema de agendamento
 Adaptar métodos para API do seu sistema
 Registrar tools MCP (availability, create, cancel, etc)
 Configurar cliente WhatsApp Business API
 Criar webhook para receber mensagens
 Implementar handler de mensagens
 Integrar MCP com processamento de mensagens
 Configurar variáveis de ambiente
 Fazer deploy na Vercel
 Configurar webhook no Meta
 Testar fluxo completo


🔒 Segurança

Validar webhook: Sempre verificar verify_token
Rate limiting: Limitar requests por usuário
Sanitizar inputs: Validar todos os dados com Zod
Secrets: Usar variáveis de ambiente, nunca hardcode
HTTPS only: Vercel fornece automaticamente


📚 Recursos Adicionais

WhatsApp Business API Docs
MCP Protocol Specification
Vercel Serverless Functions
Next.js API Routes


💡 Dicas Importantes
Adaptando para SEU Sistema de Agendamento

Identifique os endpoints: Liste todos os endpoints da sua API
Mapeie os campos: Anote como sua API nomeia cada campo
Teste manualmente: Use Postman/Insomnia para testar cada endpoint
Adapte os métodos: Modifique SchedulingSystemClient conforme sua API
Trate erros específicos: Cada sistema tem seus códigos de erro

Exemplo de Mapeamento
SUA API → CÓDIGO
- POST /bookings → createAppointment()
- GET /bookings/available → getAvailability()
- DELETE /bookings/:id → cancelAppointment()

Campo "client_name" → customerName
Campo "phone_number" → customerPhone
Performance na Vercel

Webhook deve responder em < 10s
Use Promise.all() para chamadas paralelas
Cache de disponibilidade quando possível
Processos longos via queue externa