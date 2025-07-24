import { storageService } from './storage.service';

export interface NotificationPreferences {
  email: {
    newContent: boolean;
    meetings: boolean;
    messages: boolean;
    marketing: boolean;
  };
  push: {
    enabled: boolean;
    newContent: boolean;
    meetings: boolean;
  };
}

export interface ScheduledNotification {
  id: string;
  type: 'meeting_24h' | 'meeting_1h' | 'response' | 'digest';
  userId: string;
  scheduledFor: Date;
  title: string;
  message: string;
  data?: any;
  sent: boolean;
  createdAt: Date;
}

export interface NotificationTemplate {
  type: string;
  subject: string;
  body: string;
  variables: string[];
}

class NotificationService {
  private readonly storageKey = 'notification_queue';
  private readonly templatesKey = 'notification_templates';
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeTemplates();
    this.startPeriodicCheck();
  }

  // Inicializar templates de notificação
  private initializeTemplates(): void {
    const existingTemplates = localStorage.getItem(this.templatesKey);
    if (!existingTemplates) {
      const defaultTemplates: NotificationTemplate[] = [
        {
          type: 'meeting_24h',
          subject: '🔔 Lembrete: Encontro do Clube do Livro amanhã!',
          body: `Olá {{name}},

Lembramos que você tem um encontro marcado para amanhã!

📅 **Encontro**: {{meetingTitle}}
🕒 **Horário**: {{meetingTime}}
📍 **Local**: {{meetingLocation}}
📚 **Capítulo**: {{chapterTitle}}

Prepare-se para uma conversa incrível sobre os insights do capítulo!

**Dicas para o encontro:**
• Releia os pontos principais do capítulo
• Anote suas reflexões e dúvidas
• Prepare-se para compartilhar suas experiências

Nos vemos lá! 💫

Atenciosamente,
Equipe Clube do Livro`,
          variables: ['name', 'meetingTitle', 'meetingTime', 'meetingLocation', 'chapterTitle']
        },
        {
          type: 'meeting_1h',
          subject: '⏰ Seu encontro começa em 1 hora!',
          body: `Oi {{name}}!

Seu encontro do Clube do Livro começa em apenas 1 hora!

📅 **Encontro**: {{meetingTitle}}
🕒 **Horário**: {{meetingTime}}
📍 **Local**: {{meetingLocation}}

🔗 **Link de acesso**: {{meetingLink}}

Não esqueça:
• Tenha o livro em mãos
• Prepare um local tranquilo
• Teste sua conexão (se online)

Te esperamos! ✨`,
          variables: ['name', 'meetingTitle', 'meetingTime', 'meetingLocation', 'meetingLink']
        },
        {
          type: 'response',
          subject: '💬 Nova resposta ao seu comentário',
          body: `Olá {{name}},

{{authorName}} respondeu ao seu comentário na comunidade!

**Seu comentário:**
"{{originalComment}}"

**Resposta:**
"{{responseComment}}"

👀 **Veja a conversa completa**: {{postLink}}

Continue participando da discussão!

Abraços,
Equipe Clube do Livro`,
          variables: ['name', 'authorName', 'originalComment', 'responseComment', 'postLink']
        },
        {
          type: 'digest',
          subject: '📚 Resumo semanal do Clube do Livro',
          body: `Olá {{name}},

Aqui está seu resumo semanal do que aconteceu no clube:

📈 **Atividade da semana:**
• {{newPosts}} novas postagens na comunidade
• {{newComments}} novos comentários
• {{activeMemberCount}} membros ativos

🔥 **Post mais curtido:**
{{topPostTitle}} - {{topPostLikes}} curtidas

🆕 **Novos conteúdos:**
{{newContentList}}

📅 **Próximos eventos:**
{{upcomingEvents}}

Não perca o ritmo da sua jornada de autoconhecimento!

{{clubSignature}}`,
          variables: ['name', 'newPosts', 'newComments', 'activeMemberCount', 'topPostTitle', 'topPostLikes', 'newContentList', 'upcomingEvents', 'clubSignature']
        }
      ];

      localStorage.setItem(this.templatesKey, JSON.stringify(defaultTemplates));
    }
  }

  // Iniciar verificação periódica de notificações
  private startPeriodicCheck(): void {
    // Verificar a cada 5 minutos
    this.checkInterval = setInterval(() => {
      this.processScheduledNotifications();
    }, 5 * 60 * 1000);

    // Verificar imediatamente também
    this.processScheduledNotifications();
  }

  // Parar verificação periódica
  public stopPeriodicCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Agendar lembrete 24h antes do encontro
  public scheduleMeeting24hReminder(meetingData: {
    userId: string;
    meetingId: string;
    meetingTitle: string;
    meetingDate: Date;
    meetingTime: string;
    meetingLocation: string;
    chapterTitle: string;
    userName: string;
  }): void {
    // Calcular 24h antes do encontro
    const reminderDate = new Date(meetingData.meetingDate);
    reminderDate.setHours(reminderDate.getHours() - 24);

    const notification: ScheduledNotification = {
      id: `meeting_24h_${meetingData.meetingId}_${Date.now()}`,
      type: 'meeting_24h',
      userId: meetingData.userId,
      scheduledFor: reminderDate,
      title: '🔔 Lembrete: Encontro do Clube do Livro amanhã!',
      message: `Seu encontro "${meetingData.meetingTitle}" é amanhã às ${meetingData.meetingTime}`,
      data: meetingData,
      sent: false,
      createdAt: new Date()
    };

    this.addToQueue(notification);
    console.log(`📅 Lembrete 24h agendado para ${reminderDate.toLocaleString()}`);
  }

  // Agendar lembrete 1h antes do encontro
  public scheduleMeeting1hReminder(meetingData: {
    userId: string;
    meetingId: string;
    meetingTitle: string;
    meetingDate: Date;
    meetingTime: string;
    meetingLocation: string;
    meetingLink?: string;
    userName: string;
  }): void {
    // Calcular 1h antes do encontro
    const reminderDate = new Date(meetingData.meetingDate);
    reminderDate.setHours(reminderDate.getHours() - 1);

    const notification: ScheduledNotification = {
      id: `meeting_1h_${meetingData.meetingId}_${Date.now()}`,
      type: 'meeting_1h',
      userId: meetingData.userId,
      scheduledFor: reminderDate,
      title: '⏰ Seu encontro começa em 1 hora!',
      message: `"${meetingData.meetingTitle}" começa em 1 hora`,
      data: meetingData,
      sent: false,
      createdAt: new Date()
    };

    this.addToQueue(notification);
    console.log(`⏰ Lembrete 1h agendado para ${reminderDate.toLocaleString()}`);
  }

  // Agendar notificação de resposta
  public scheduleResponseNotification(responseData: {
    userId: string;
    userName: string;
    authorName: string;
    originalComment: string;
    responseComment: string;
    postId: string;
    postTitle: string;
  }): void {
    const notification: ScheduledNotification = {
      id: `response_${responseData.postId}_${Date.now()}`,
      type: 'response',
      userId: responseData.userId,
      scheduledFor: new Date(), // Imediato
      title: '💬 Nova resposta ao seu comentário',
      message: `${responseData.authorName} respondeu ao seu comentário`,
      data: responseData,
      sent: false,
      createdAt: new Date()
    };

    this.addToQueue(notification);
    console.log(`💬 Notificação de resposta agendada para envio imediato`);
  }

  // Agendar digest semanal
  public scheduleWeeklyDigest(userId: string, digestData: any): void {
    // Agendar para próxima segunda-feira às 9h
    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + (1 + 7 - nextMonday.getDay()) % 7);
    nextMonday.setHours(9, 0, 0, 0);

    const notification: ScheduledNotification = {
      id: `digest_${userId}_${Date.now()}`,
      type: 'digest',
      userId,
      scheduledFor: nextMonday,
      title: '📚 Resumo semanal do Clube do Livro',
      message: 'Veja o que aconteceu esta semana no clube',
      data: digestData,
      sent: false,
      createdAt: new Date()
    };

    this.addToQueue(notification);
    console.log(`📊 Digest semanal agendado para ${nextMonday.toLocaleString()}`);
  }

  // Adicionar notificação à fila
  private addToQueue(notification: ScheduledNotification): void {
    const queue = this.getQueue();
    queue.push(notification);
    localStorage.setItem(this.storageKey, JSON.stringify(queue));
  }

  // Obter fila de notificações
  private getQueue(): ScheduledNotification[] {
    const queue = localStorage.getItem(this.storageKey);
    return queue ? JSON.parse(queue) : [];
  }

  // Processar notificações agendadas
  private processScheduledNotifications(): void {
    const queue = this.getQueue();
    const now = new Date();
    let hasChanges = false;

    for (const notification of queue) {
      if (!notification.sent && new Date(notification.scheduledFor) <= now) {
        this.sendNotification(notification);
        notification.sent = true;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      localStorage.setItem(this.storageKey, JSON.stringify(queue));
    }
  }

  // Enviar notificação (simular envio)
  private sendNotification(notification: ScheduledNotification): void {
    const user = storageService.getUserData();
    const userPrefs = this.getUserNotificationPreferences(notification.userId);

    // Verificar se usuário quer receber este tipo de notificação
    const shouldSend = this.shouldSendNotification(notification.type, userPrefs);
    
    if (!shouldSend) {
      console.log(`🚫 Notificação cancelada: usuário optou por não receber ${notification.type}`);
      return;
    }

    // Simular envio por email
    if (userPrefs.email.meetings && (notification.type === 'meeting_24h' || notification.type === 'meeting_1h')) {
      this.simulateEmailSend(notification);
    }

    // Simular notificação push do navegador
    if (userPrefs.push.enabled && userPrefs.push.meetings && (notification.type === 'meeting_24h' || notification.type === 'meeting_1h')) {
      this.simulatePushNotification(notification);
    }

    console.log(`✅ Notificação enviada: ${notification.title}`);
  }

  // Verificar se deve enviar notificação baseado nas preferências
  private shouldSendNotification(type: string, prefs: NotificationPreferences): boolean {
    switch (type) {
      case 'meeting_24h':
      case 'meeting_1h':
        return prefs.email.meetings || prefs.push.meetings;
      case 'response':
        return prefs.email.messages;
      case 'digest':
        return prefs.email.newContent;
      default:
        return false;
    }
  }

  // Obter preferências de notificação do usuário
  private getUserNotificationPreferences(userId: string): NotificationPreferences {
    // Em produção, isso viria do banco de dados
    // Por enquanto, usar configurações do localStorage
    const settingsData = localStorage.getItem('user_settings');
    if (settingsData) {
      const settings = JSON.parse(settingsData);
      return settings.notifications || this.getDefaultPreferences();
    }
    return this.getDefaultPreferences();
  }

  // Preferências padrão
  private getDefaultPreferences(): NotificationPreferences {
    return {
      email: {
        newContent: true,
        meetings: true,
        messages: true,
        marketing: false
      },
      push: {
        enabled: false,
        newContent: true,
        meetings: true
      }
    };
  }

  // Simular envio de email
  private simulateEmailSend(notification: ScheduledNotification): void {
    const template = this.getTemplate(notification.type);
    if (template) {
      const renderedContent = this.renderTemplate(template, notification.data);
      console.log(`📧 Email enviado:`, {
        to: notification.data?.email || 'user@email.com',
        subject: renderedContent.subject,
        body: renderedContent.body.substring(0, 100) + '...'
      });
    }
  }

  // Simular notificação push
  private simulatePushNotification(notification: ScheduledNotification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    } else {
      console.log(`🔔 Push notification (simulada):`, {
        title: notification.title,
        body: notification.message
      });
    }
  }

  // Obter template de notificação
  private getTemplate(type: string): NotificationTemplate | null {
    const templates = localStorage.getItem(this.templatesKey);
    if (templates) {
      const parsedTemplates: NotificationTemplate[] = JSON.parse(templates);
      return parsedTemplates.find(t => t.type === type) || null;
    }
    return null;
  }

  // Renderizar template com variáveis
  private renderTemplate(template: NotificationTemplate, data: any): { subject: string; body: string } {
    let subject = template.subject;
    let body = template.body;

    // Substituir variáveis no subject e body
    for (const variable of template.variables) {
      const placeholder = `{{${variable}}}`;
      const value = data[variable] || `[${variable}]`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      body = body.replace(new RegExp(placeholder, 'g'), value);
    }

    return { subject, body };
  }

  // Métodos públicos para gerenciamento

  // Obter estatísticas da fila
  public getQueueStats(): { total: number; pending: number; sent: number } {
    const queue = this.getQueue();
    return {
      total: queue.length,
      pending: queue.filter(n => !n.sent).length,
      sent: queue.filter(n => n.sent).length
    };
  }

  // Limpar notificações antigas (mais de 30 dias)
  public cleanupOldNotifications(): void {
    const queue = this.getQueue();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const cleanedQueue = queue.filter(n => 
      new Date(n.createdAt) > thirtyDaysAgo || !n.sent
    );

    localStorage.setItem(this.storageKey, JSON.stringify(cleanedQueue));
    console.log(`🧹 Limpeza concluída: removidas ${queue.length - cleanedQueue.length} notificações antigas`);
  }

  // Cancelar notificação específica
  public cancelNotification(notificationId: string): void {
    const queue = this.getQueue();
    const filteredQueue = queue.filter(n => n.id !== notificationId);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredQueue));
    console.log(`❌ Notificação cancelada: ${notificationId}`);
  }

  // Listar próximas notificações
  public getUpcomingNotifications(limit: number = 10): ScheduledNotification[] {
    const queue = this.getQueue();
    return queue
      .filter(n => !n.sent)
      .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
      .slice(0, limit);
  }

  // Método público para agendar notificação customizada
  public scheduleCustomNotification(
    type: string,
    userId: string,
    scheduledFor: Date,
    title: string,
    message: string,
    data?: any
  ): void {
    const notification: ScheduledNotification = {
      id: `custom_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type as any,
      userId,
      scheduledFor,
      title,
      message,
      data,
      sent: false,
      createdAt: new Date()
    };

    this.addToQueue(notification);
  }
}

export const notificationService = new NotificationService();