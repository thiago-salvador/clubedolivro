// Serviço de agendamento de tarefas (emails, notificações, etc.)
// Em produção, seria substituído por uma solução como Cron Jobs, AWS Lambda, etc.

import { emailService } from './email.service';
import { whatsappService } from './whatsapp.service';

interface ScheduledTask {
  id: string;
  type: 'meeting_reminder' | 'newsletter' | 'follow_up';
  scheduledFor: Date;
  data: any;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  maxAttempts: number;
}

interface MeetingReminderData {
  emails: string[];
  phones?: string[];
  meetingTitle: string;
  meetingDate: string;
  meetingTime: string;
  meetingDescription: string;
  facilitator: string;
  meetingUrl: string;
}

interface NewsletterData {
  emails: string[];
  weekOf: string;
  highlight: string;
  upcomingMeetings: Array<{title: string; date: string; time: string}>;
  trendingTopics: Array<{title: string; comments: number}>;
  reflection: string;
}

// Armazenamento em memória (em produção, seria um banco de dados)
let SCHEDULED_TASKS: ScheduledTask[] = [];
let taskIdCounter = 1;

// Delay simulado
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Executar tarefa agendada
const executeTask = async (task: ScheduledTask): Promise<boolean> => {
  try {
    switch (task.type) {
      case 'meeting_reminder':
        await executeMeetingReminder(task.data as MeetingReminderData);
        break;
      case 'newsletter':
        await executeNewsletter(task.data as NewsletterData);
        break;
      case 'follow_up':
        await executeFollowUp(task.data);
        break;
      default:
        throw new Error(`Tipo de tarefa desconhecido: ${task.type}`);
    }
    return true;
  } catch (error) {
    console.error(`Erro ao executar tarefa ${task.id}:`, error);
    return false;
  }
};

// Executar lembrete de encontro
const executeMeetingReminder = async (data: MeetingReminderData): Promise<void> => {
  // Enviar emails
  const emailPromises = data.emails.map(email => 
    emailService.sendMeetingReminder(email, {
      title: data.meetingTitle,
      date: data.meetingDate,
      time: data.meetingTime,
      description: data.meetingDescription,
      facilitator: data.facilitator,
      meetingUrl: data.meetingUrl
    })
  );
  
  // Enviar WhatsApp (se houver números)
  const whatsappPromises = data.phones?.map(phone => 
    whatsappService.sendMeetingReminder(
      phone,
      'Querida', // Nome genérico, em produção buscaria do banco
      data.meetingTitle,
      `${data.meetingDate} às ${data.meetingTime}`,
      data.meetingUrl
    )
  ) || [];
  
  await Promise.allSettled([...emailPromises, ...whatsappPromises]);
};

// Executar newsletter
const executeNewsletter = async (data: NewsletterData): Promise<void> => {
  const promises = data.emails.map(email => 
    emailService.sendWeeklyNewsletter(email, {
      weekOf: data.weekOf,
      highlight: data.highlight,
      upcomingMeetings: data.upcomingMeetings,
      trendingTopics: data.trendingTopics,
      reflection: data.reflection
    })
  );
  
  await Promise.allSettled(promises);
};

// Executar follow-up genérico
const executeFollowUp = async (data: any): Promise<void> => {
  // Implementar conforme necessário
  console.log('Executando follow-up:', data);
};

// Verificar e executar tarefas pendentes
const processPendingTasks = async (): Promise<void> => {
  const now = new Date();
  const pendingTasks = SCHEDULED_TASKS.filter(
    task => task.status === 'pending' && task.scheduledFor <= now
  );

  for (const task of pendingTasks) {
    if (task.attempts >= task.maxAttempts) {
      task.status = 'failed';
      continue;
    }

    task.attempts++;
    const success = await executeTask(task);
    
    if (success) {
      task.status = 'sent';
    } else if (task.attempts >= task.maxAttempts) {
      task.status = 'failed';
    }
    
    // Pequeno delay entre tarefas
    await delay(100);
  }
};

// Iniciar processamento automático
let isProcessing = false;
const startProcessor = () => {
  if (isProcessing) return;
  
  isProcessing = true;
  const processInterval = setInterval(async () => {
    try {
      await processPendingTasks();
    } catch (error) {
      console.error('Erro no processador de tarefas:', error);
    }
  }, 60000); // Verificar a cada minuto

  // Limpar tarefas antigas (mais de 7 dias)
  setInterval(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    SCHEDULED_TASKS = SCHEDULED_TASKS.filter(
      task => task.scheduledFor > weekAgo
    );
  }, 24 * 60 * 60 * 1000); // Uma vez por dia
};

export const schedulerService = {
  // Inicializar o serviço
  initialize() {
    startProcessor();
    this.scheduleWeeklyNewsletter(); // Agendar newsletter semanal
    console.log('📅 Scheduler service inicializado');
  },

  // Agendar lembrete de encontro
  scheduleMeetingReminder(
    emails: string[],
    meetingData: {
      title: string;
      date: string;
      time: string;
      description: string;
      facilitator: string;
      meetingUrl: string;
    },
    reminderTime: Date,
    phones?: string[]
  ): string {
    const taskId = `meeting_${taskIdCounter++}`;
    
    const task: ScheduledTask = {
      id: taskId,
      type: 'meeting_reminder',
      scheduledFor: reminderTime,
      data: {
        emails,
        phones,
        meetingTitle: meetingData.title,
        meetingDate: meetingData.date,
        meetingTime: meetingData.time,
        meetingDescription: meetingData.description,
        facilitator: meetingData.facilitator,
        meetingUrl: meetingData.meetingUrl
      } as MeetingReminderData,
      status: 'pending',
      attempts: 0,
      maxAttempts: 3
    };
    
    SCHEDULED_TASKS.push(task);
    
    console.log(`📅 Lembrete agendado para ${reminderTime.toISOString()}`);
    return taskId;
  },

  // Agendar newsletter semanal
  scheduleWeeklyNewsletter(): string {
    const taskId = `newsletter_${taskIdCounter++}`;
    
    // Agendar para toda segunda-feira às 9h
    const nextMonday = new Date();
    const daysUntilMonday = (1 + 7 - nextMonday.getDay()) % 7;
    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
    nextMonday.setHours(9, 0, 0, 0);
    
    // Se já passou das 9h da segunda, agendar para a próxima segunda
    if (nextMonday <= new Date()) {
      nextMonday.setDate(nextMonday.getDate() + 7);
    }
    
    const task: ScheduledTask = {
      id: taskId,
      type: 'newsletter',
      scheduledFor: nextMonday,
      data: {
        emails: ['maria@exemplo.com'], // Em produção, buscar todos os emails ativos
        weekOf: `Semana de ${nextMonday.toLocaleDateString('pt-BR')}`,
        highlight: 'Esta semana exploramos o capítulo sobre La Loba e sua sabedoria ancestral.',
        upcomingMeetings: [
          { title: 'Encontro Capítulo 3', date: '25/01/2025', time: '19:00' },
          { title: 'Roda de Conversa', date: '27/01/2025', time: '10:00' }
        ],
        trendingTopics: [
          { title: 'Reconectando com a intuição', comments: 23 },
          { title: 'Histórias de transformação', comments: 18 }
        ],
        reflection: 'Que aspectos de sua natureza selvagem você tem negligenciado?'
      } as NewsletterData,
      status: 'pending',
      attempts: 0,
      maxAttempts: 3
    };
    
    SCHEDULED_TASKS.push(task);
    
    console.log(`📧 Newsletter agendada para ${nextMonday.toISOString()}`);
    return taskId;
  },

  // Agendar lembrete automático para encontros próximos
  scheduleUpcomingMeetingReminders(): void {
    // Simulação de encontros próximos
    const upcomingMeetings = [
      {
        title: 'Encontro Capítulo 3: A Busca do Amado',
        date: '25/01/2025',
        time: '19:00',
        description: 'Neste encontro, vamos explorar o arquétipo do amado interior e como reconectar com nossa capacidade de amar e ser amadas.',
        facilitator: 'Manu Xavier',
        meetingUrl: 'https://zoom.us/j/123456789'
      },
      {
        title: 'Roda de Conversa: Compartilhando Experiências',
        date: '27/01/2025',
        time: '10:00',
        description: 'Um espaço seguro para compartilhar insights e experiências da jornada de autoconhecimento.',
        facilitator: 'Carolina Luz',
        meetingUrl: 'https://zoom.us/j/987654321'
      }
    ];

    const subscribedEmails = ['maria@exemplo.com']; // Em produção, buscar do banco
    const subscribedPhones = ['11999887766']; // Em produção, buscar do banco

    upcomingMeetings.forEach(meeting => {
      // Agendar lembrete para 2 horas antes do encontro
      const [day, month, year] = meeting.date.split('/');
      const [hour, minute] = meeting.time.split(':');
      
      const meetingDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
      );
      
      const reminderTime = new Date(meetingDateTime.getTime() - 2 * 60 * 60 * 1000); // 2 horas antes
      
      // Só agendar se for no futuro
      if (reminderTime > new Date()) {
        this.scheduleMeetingReminder(subscribedEmails, meeting, reminderTime, subscribedPhones);
      }
    });
  },

  // Obter status das tarefas
  getTaskStatus(): {
    total: number;
    pending: number;
    sent: number;
    failed: number;
    recent: ScheduledTask[];
  } {
    const recent = SCHEDULED_TASKS
      .sort((a, b) => b.scheduledFor.getTime() - a.scheduledFor.getTime())
      .slice(0, 10);

    return {
      total: SCHEDULED_TASKS.length,
      pending: SCHEDULED_TASKS.filter(t => t.status === 'pending').length,
      sent: SCHEDULED_TASKS.filter(t => t.status === 'sent').length,
      failed: SCHEDULED_TASKS.filter(t => t.status === 'failed').length,
      recent
    };
  },

  // Cancelar tarefa
  cancelTask(taskId: string): boolean {
    const taskIndex = SCHEDULED_TASKS.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return false;
    
    SCHEDULED_TASKS.splice(taskIndex, 1);
    return true;
  },

  // Executar tarefa imediatamente (para testes)
  async executeTaskNow(taskId: string): Promise<boolean> {
    const task = SCHEDULED_TASKS.find(t => t.id === taskId);
    if (!task) return false;
    
    const success = await executeTask(task);
    if (success) {
      task.status = 'sent';
    } else {
      task.attempts++;
      if (task.attempts >= task.maxAttempts) {
        task.status = 'failed';
      }
    }
    
    return success;
  }
};

// Auto-inicializar em ambientes de desenvolvimento
if (process.env.NODE_ENV === 'development') {
  // Aguardar um pouco antes de inicializar para evitar problemas de importação
  setTimeout(() => {
    schedulerService.initialize();
    schedulerService.scheduleUpcomingMeetingReminders();
  }, 1000);
}