import { createApiResponse, createApiError, ApiResponse, API_CONFIG } from '../config';
import { notificationService, ScheduledNotification } from '../../services/notification.service';
import { emailService } from '../../services/email.service';
import { whatsappService } from '../../services/whatsapp.service';
import { studentService } from '../../services/student.service';

export const notificationController = {
  // Listar notificações
  async getAll(params: any): Promise<ApiResponse> {
    try {
      const { 
        page = 1, 
        limit = API_CONFIG.pagination.defaultLimit,
        type,
        sent
      } = params;
      
      let notifications = notificationService.getUpcomingNotifications(100);
      
      // Filtrar por tipo
      if (type) {
        notifications = notifications.filter(n => n.type === type);
      }
      
      // Filtrar por status de envio
      if (sent !== undefined) {
        const isSent = sent === 'true';
        notifications = notifications.filter(n => n.sent === isSent);
      }
      
      // Paginar
      const total = notifications.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const paginatedNotifications = notifications.slice(start, start + limit);
      
      return createApiResponse(paginatedNotifications, undefined, {
        page,
        limit,
        total,
        totalPages
      });
      
    } catch (error: any) {
      return createApiError('FETCH_ERROR', error.message || 'Erro ao buscar notificações', 500);
    }
  },
  
  // Enviar notificação por email
  async send(params: any, body: any): Promise<ApiResponse> {
    try {
      const {
        subject,
        body: content,
        recipientType,
        recipientIds,
        selectedTags,
        customEmails,
        channel = 'email' // email, whatsapp, both
      } = body;
      
      // Validações
      if (!subject || !content) {
        return createApiError('VALIDATION_ERROR', 'Assunto e conteúdo são obrigatórios', 400);
      }
      
      // Determinar destinatários
      let recipients: string[] = [];
      
      switch (recipientType) {
        case 'all':
          const allStudents = await studentService.getAllStudents();
          recipients = allStudents.map(s => s.email);
          break;
          
        case 'active':
          const activeStudents = await studentService.getAllStudents();
          recipients = activeStudents.filter(s => s.isActive).map(s => s.email);
          break;
          
        case 'inactive':
          const inactiveStudents = await studentService.getAllStudents();
          recipients = inactiveStudents.filter(s => !s.isActive).map(s => s.email);
          break;
          
        case 'specific':
          if (recipientIds && Array.isArray(recipientIds)) {
            for (const id of recipientIds) {
              const student = await studentService.getStudentById(id);
              if (student) {
                recipients.push(student.email);
              }
            }
          }
          break;
          
        case 'tags':
          if (selectedTags && Array.isArray(selectedTags)) {
            const students = await studentService.getStudentsByFilter({ tags: selectedTags });
            recipients = students.map(s => s.email);
          }
          break;
          
        case 'custom':
          if (customEmails) {
            recipients = customEmails.split(',').map((e: string) => e.trim()).filter((e: string) => e);
          }
          break;
      }
      
      if (recipients.length === 0) {
        return createApiError('NO_RECIPIENTS', 'Nenhum destinatário selecionado', 400);
      }
      
      // Enviar notificações
      const results = {
        total: recipients.length,
        sent: 0,
        failed: 0,
        errors: [] as string[]
      };
      
      for (const recipient of recipients) {
        try {
          if (channel === 'email' || channel === 'both') {
            await emailService.sendEmail({
              to: recipient,
              template: 'notification',
              data: {
                title: subject,
                message: content
              }
            });
          }
          
          if (channel === 'whatsapp' || channel === 'both') {
            // Buscar telefone do destinatário
            const students = await studentService.getAllStudents();
            const student = students.find(s => s.email === recipient);
            if (student?.phoneNumber) {
              await whatsappService.sendTextMessage(student.phoneNumber, content);
            }
          }
          
          results.sent++;
        } catch (error: any) {
          results.failed++;
          results.errors.push(`Erro ao enviar para ${recipient}: ${error.message}`);
        }
      }
      
      return createApiResponse(results, 
        `Notificação enviada: ${results.sent} sucesso, ${results.failed} falhas`
      );
      
    } catch (error: any) {
      return createApiError('SEND_ERROR', error.message || 'Erro ao enviar notificação', 500);
    }
  },
  
  // Agendar notificação
  async schedule(params: any, body: any): Promise<ApiResponse> {
    try {
      const {
        type,
        scheduledFor,
        title,
        message,
        data
      } = body;
      
      // Validações
      if (!type || !scheduledFor || !title || !message) {
        return createApiError('VALIDATION_ERROR', 'Tipo, data, título e mensagem são obrigatórios', 400);
      }
      
      const scheduledDate = new Date(scheduledFor);
      if (scheduledDate <= new Date()) {
        return createApiError('INVALID_DATE', 'Data deve ser no futuro', 400);
      }
      
      // Criar notificação agendada
      const notification = notificationService.scheduleCustomNotification(
        type,
        'admin',
        scheduledDate,
        title,
        message,
        data
      );
      
      return createApiResponse(notification, 'Notificação agendada com sucesso');
      
    } catch (error: any) {
      return createApiError('SCHEDULE_ERROR', error.message || 'Erro ao agendar notificação', 500);
    }
  },
  
  // Cancelar notificação
  async cancel(params: any): Promise<ApiResponse> {
    try {
      const { id } = params;
      
      if (!id) {
        return createApiError('VALIDATION_ERROR', 'ID é obrigatório', 400);
      }
      
      const cancelled = notificationService.cancelNotification(id);
      
      if (!cancelled) {
        return createApiError('NOT_FOUND', 'Notificação não encontrada ou já enviada', 404);
      }
      
      return createApiResponse({}, 'Notificação cancelada com sucesso');
      
    } catch (error: any) {
      return createApiError('CANCEL_ERROR', error.message || 'Erro ao cancelar notificação', 500);
    }
  },
  
  // Estatísticas da fila
  async getQueueStats(): Promise<ApiResponse> {
    try {
      const stats = notificationService.getQueueStats();
      return createApiResponse(stats);
      
    } catch (error: any) {
      return createApiError('STATS_ERROR', error.message || 'Erro ao buscar estatísticas', 500);
    }
  },
  
  // Templates de notificação
  async getTemplates(): Promise<ApiResponse> {
    try {
      const templates = notificationService.getTemplates();
      return createApiResponse(templates);
      
    } catch (error: any) {
      return createApiError('TEMPLATES_ERROR', error.message || 'Erro ao buscar templates', 500);
    }
  },
  
  // Criar template
  async createTemplate(params: any, body: any): Promise<ApiResponse> {
    try {
      const { type, subject, body: content, variables } = body;
      
      if (!type || !subject || !content) {
        return createApiError('VALIDATION_ERROR', 'Tipo, assunto e conteúdo são obrigatórios', 400);
      }
      
      const template = notificationService.createTemplate({
        type,
        subject,
        body: content,
        variables: variables || []
      });
      
      return createApiResponse(template, 'Template criado com sucesso');
      
    } catch (error: any) {
      return createApiError('CREATE_TEMPLATE_ERROR', error.message || 'Erro ao criar template', 500);
    }
  },
  
  // Enviar notificação de teste
  async sendTest(params: any, body: any): Promise<ApiResponse> {
    try {
      const { to, subject, content, channel = 'email' } = body;
      
      if (!to || !content) {
        return createApiError('VALIDATION_ERROR', 'Destinatário e conteúdo são obrigatórios', 400);
      }
      
      if (channel === 'email') {
        await emailService.sendEmail({
          to,
          template: 'notification',
          data: {
            title: subject || 'Teste',
            message: content
          }
        });
      } else if (channel === 'whatsapp') {
        await whatsappService.sendTextMessage(to, content);
      }
      
      return createApiResponse({}, 'Notificação de teste enviada com sucesso');
      
    } catch (error: any) {
      return createApiError('TEST_ERROR', error.message || 'Erro ao enviar teste', 500);
    }
  }
};