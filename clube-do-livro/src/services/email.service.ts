// Simulação de um serviço de email
// Este arquivo pode ser facilmente substituído por integrações reais (SendGrid, Mailgun, AWS SES, etc)

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface EmailRequest {
  to: string;
  template: string;
  data: Record<string, any>;
  attachments?: {
    filename: string;
    content: string;
    type: string;
  }[];
}

interface EmailResponse {
  messageId: string;
  status: 'sent' | 'queued' | 'failed';
  timestamp: Date;
  to: string;
  subject: string;
}

// Templates de email
const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  welcome: {
    subject: '🎉 Bem-vinda ao Clube do Livro!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E07A5F; margin-bottom: 10px;">Clube do Livro</h1>
          <h2 style="color: #F4A261; margin-top: 0;">Mulheres que Correm com os Lobos</h2>
        </div>
        
        <div style="background: #FFF5F5; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #E07A5F;">Olá, {{name}}! 🌟</h3>
          <p>Seja muito bem-vinda ao nosso círculo sagrado de mulheres!</p>
          <p>Sua jornada de autoconhecimento e reconexão com sua essência selvagem começa agora.</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h4 style="color: #E07A5F;">📚 Seus próximos passos:</h4>
          <ol style="line-height: 1.6;">
            <li><strong>Acesse sua área da aluna:</strong> <a href="{{loginUrl}}" style="color: #E07A5F;">Entrar agora</a></li>
            <li><strong>Entre no nosso grupo do WhatsApp:</strong> <a href="{{whatsappUrl}}" style="color: #E07A5F;">Participar</a></li>
            <li><strong>Baixe o material complementar:</strong> Guia da Jornada Interior</li>
          </ol>
        </div>

        <div style="background: #F7F3F0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #E07A5F; margin-top: 0;">💡 Dica importante:</h4>
          <p style="margin-bottom: 0;">Mantenha este email salvo - ele contém informações importantes sobre sua participação no clube.</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666;">Com carinho,<br><strong>Equipe Clube do Livro</strong></p>
        </div>
        
        <div style="text-align: center; font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <p>Clube do Livro - Mulheres que Correm com os Lobos</p>
          <p>Este email foi enviado para {{email}}</p>
        </div>
      </div>
    `,
    text: `
Olá, {{name}}!

Seja muito bem-vinda ao Clube do Livro - Mulheres que Correm com os Lobos!

Sua jornada de autoconhecimento começa agora. Aqui estão seus próximos passos:

1. Acesse sua área da aluna: {{loginUrl}}
2. Entre no grupo do WhatsApp: {{whatsappUrl}}
3. Baixe o material complementar

Mantenha este email salvo com suas informações de acesso.

Com carinho,
Equipe Clube do Livro
    `
  },

  payment_confirmation: {
    subject: '✅ Pagamento confirmado - Clube do Livro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
          <h2 style="color: #E07A5F; margin: 0;">Pagamento Confirmado!</h2>
        </div>
        
        <div style="background: #F0FDF4; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
          <p><strong>Olá, {{customerName}}!</strong></p>
          <p>Seu pagamento foi processado com sucesso. Agora você tem acesso completo ao Clube do Livro!</p>
        </div>

        <div style="background: #F9FAFB; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
          <h4 style="color: #E07A5F; margin-top: 0;">📄 Detalhes da compra:</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 5px 0;"><strong>Produto:</strong></td><td>{{productName}}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Valor:</strong></td><td>R$ {{amount}}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Método:</strong></td><td>{{paymentMethod}}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Data:</strong></td><td>{{paymentDate}}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>ID:</strong></td><td style="font-family: monospace; font-size: 12px;">{{transactionId}}</td></tr>
          </table>
        </div>

        <div style="text-align: center; margin: 25px 0;">
          <a href="{{loginUrl}}" style="background: #E07A5F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            ACESSAR ÁREA DA ALUNA
          </a>
        </div>

        <div style="text-align: center; font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <p>Este comprovante foi enviado para {{customerEmail}}</p>
          <p>Em caso de dúvidas: contato@clubedolivro.com.br</p>
        </div>
      </div>
    `,
    text: `
PAGAMENTO CONFIRMADO ✅

Olá, {{customerName}}!

Seu pagamento foi processado com sucesso.

DETALHES DA COMPRA:
- Produto: {{productName}}
- Valor: R$ {{amount}}
- Método: {{paymentMethod}}
- Data: {{paymentDate}}
- ID: {{transactionId}}

Acesse sua área da aluna: {{loginUrl}}

Dúvidas: contato@clubedolivro.com.br
    `
  },

  meeting_reminder: {
    subject: '📅 Lembrete: Encontro hoje às {{meetingTime}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 25px;">
          <div style="font-size: 48px; margin-bottom: 10px;">📅</div>
          <h2 style="color: #E07A5F; margin: 0;">Encontro Hoje!</h2>
        </div>
        
        <div style="background: #FEF3C7; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #F59E0B;">
          <h3 style="color: #92400E; margin-top: 0;">{{meetingTitle}}</h3>
          <p style="margin-bottom: 10px;"><strong>📅 Data:</strong> {{meetingDate}}</p>
          <p style="margin-bottom: 10px;"><strong>⏰ Horário:</strong> {{meetingTime}}</p>
          <p style="margin-bottom: 0;"><strong>📍 Local:</strong> Online (link abaixo)</p>
        </div>

        <div style="background: #F0F9FF; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
          <h4 style="color: #1E40AF; margin-top: 0;">📋 Sobre o encontro:</h4>
          <p>{{meetingDescription}}</p>
          <p><strong>Facilitadora:</strong> {{facilitator}}</p>
        </div>

        <div style="text-align: center; margin: 25px 0;">
          <a href="{{meetingUrl}}" style="background: #E07A5F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin-bottom: 10px;">
            ENTRAR NA SALA
          </a>
          <p style="font-size: 12px; color: #666; margin: 0;">Recomendamos entrar 5 minutos antes</p>
        </div>

        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px;">
          <h5 style="color: #374151; margin-top: 0;">💡 Dicas para o encontro:</h5>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Encontre um local tranquilo</li>
            <li>Tenha papel e caneta por perto</li>
            <li>Teste seu microfone antes</li>
          </ul>
        </div>
      </div>
    `,
    text: `
LEMBRETE: ENCONTRO HOJE! 📅

{{meetingTitle}}

📅 Data: {{meetingDate}}
⏰ Horário: {{meetingTime}}
📍 Local: Online

Sobre o encontro:
{{meetingDescription}}

Facilitadora: {{facilitator}}

Link da sala: {{meetingUrl}}

Dicas:
- Entre 5 minutos antes
- Encontre um local tranquilo
- Teste seu microfone
    `
  },

  newsletter: {
    subject: '📖 Newsletter Semanal - Clube do Livro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E07A5F;">Newsletter Semanal</h1>
          <p style="color: #666;">{{weekOf}}</p>
        </div>
        
        <div style="background: #FFF5F5; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
          <h3 style="color: #E07A5F; margin-top: 0;">🌟 Destaques da semana</h3>
          <p>{{weeklyHighlight}}</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h4 style="color: #E07A5F;">📅 Próximos encontros:</h4>
          {{#upcomingMeetings}}
          <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
            <p style="margin: 0;"><strong>{{title}}</strong></p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">{{date}} às {{time}}</p>
          </div>
          {{/upcomingMeetings}}
        </div>

        <div style="margin-bottom: 25px;">
          <h4 style="color: #E07A5F;">💬 Discussões em alta:</h4>
          {{#trendingTopics}}
          <div style="border-left: 3px solid #E07A5F; padding-left: 15px; margin-bottom: 15px;">
            <p style="margin: 0; font-weight: bold;">{{title}}</p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">{{comments}} comentários</p>
          </div>
          {{/trendingTopics}}
        </div>

        <div style="background: #F0F9FF; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
          <h4 style="color: #1E40AF; margin-top: 0;">🎯 Reflexão da semana</h4>
          <p style="font-style: italic;">"{{weeklyReflection}}"</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="{{clubUrl}}" style="background: #E07A5F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            ACESSAR O CLUBE
          </a>
        </div>
      </div>
    `,
    text: `
NEWSLETTER SEMANAL - CLUBE DO LIVRO
{{weekOf}}

🌟 DESTAQUES DA SEMANA:
{{weeklyHighlight}}

📅 PRÓXIMOS ENCONTROS:
{{#upcomingMeetings}}
- {{title}} - {{date}} às {{time}}
{{/upcomingMeetings}}

💬 DISCUSSÕES EM ALTA:
{{#trendingTopics}}
- {{title}} ({{comments}} comentários)
{{/trendingTopics}}

🎯 REFLEXÃO DA SEMANA:
"{{weeklyReflection}}"

Acesse o clube: {{clubUrl}}
    `
  },

  password_reset: {
    subject: '🔐 Redefinir senha - Clube do Livro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 15px;">🔐</div>
          <h2 style="color: #E07A5F;">Redefinir Senha</h2>
        </div>
        
        <div style="background: #FEF3C7; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
          <p><strong>Olá, {{name}}!</strong></p>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta no Clube do Livro.</p>
        </div>

        <div style="text-align: center; margin: 25px 0;">
          <a href="{{resetUrl}}" style="background: #E07A5F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            REDEFINIR MINHA SENHA
          </a>
        </div>

        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px;"><strong>⚠️ Importante:</strong></p>
          <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
            <li>Este link expira em 30 minutos</li>
            <li>Se você não solicitou esta alteração, ignore este email</li>
            <li>Por segurança, o link só pode ser usado uma vez</li>
          </ul>
        </div>

        <div style="text-align: center; font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; font-family: monospace;">{{resetUrl}}</p>
        </div>
      </div>
    `,
    text: `
REDEFINIR SENHA - CLUBE DO LIVRO

Olá, {{name}}!

Recebemos uma solicitação para redefinir sua senha.

Para continuar, acesse o link abaixo:
{{resetUrl}}

IMPORTANTE:
- Este link expira em 30 minutos
- Se você não solicitou, ignore este email
- O link só pode ser usado uma vez

Clube do Livro
    `
  }
};

// Simular delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Renderizar template com dados
const renderTemplate = (template: EmailTemplate, data: Record<string, any>): EmailTemplate => {
  let html = template.html;
  let text = template.text;
  let subject = template.subject;

  // Substituir variáveis simples {{variable}}
  Object.keys(data).forEach(key => {
    const value = data[key];
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value);
    text = text.replace(regex, value);
    subject = subject.replace(regex, value);
  });

  // Processar arrays com {{#array}} ... {{/array}}
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (Array.isArray(value)) {
      const startRegex = new RegExp(`{{#${key}}}([\\s\\S]*?){{/${key}}}`, 'g');
      
      html = html.replace(startRegex, (match, template) => {
        return value.map(item => {
          let itemHtml = template;
          Object.keys(item).forEach(itemKey => {
            const itemRegex = new RegExp(`{{${itemKey}}}`, 'g');
            itemHtml = itemHtml.replace(itemRegex, item[itemKey]);
          });
          return itemHtml;
        }).join('');
      });

      text = text.replace(startRegex, (match, template) => {
        return value.map(item => {
          let itemText = template;
          Object.keys(item).forEach(itemKey => {
            const itemRegex = new RegExp(`{{${itemKey}}}`, 'g');
            itemText = itemText.replace(itemRegex, item[itemKey]);
          });
          return itemText;
        }).join('');
      });
    }
  });

  return { html, text, subject };
};

// Gerar ID único para email
const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const emailService = {
  // Enviar email
  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    await delay(1000); // Simula latência de API

    const template = EMAIL_TEMPLATES[request.template];
    if (!template) {
      throw new Error(`Template '${request.template}' não encontrado`);
    }

    // Renderizar template
    const rendered = renderTemplate(template, request.data);
    
    // Simular falha ocasional (5% de chance)
    if (Math.random() < 0.05) {
      throw new Error('Falha no envio do email');
    }

    const messageId = generateMessageId();
    
    // Log do email (em produção, seria enviado via API real)
    console.log('📧 Email enviado:', {
      messageId,
      to: request.to,
      subject: rendered.subject,
      template: request.template,
      timestamp: new Date()
    });

    return {
      messageId,
      status: 'sent',
      timestamp: new Date(),
      to: request.to,
      subject: rendered.subject
    };
  },

  // Enviar email de boas-vindas
  async sendWelcomeEmail(to: string, name: string): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      template: 'welcome',
      data: {
        name,
        email: to,
        loginUrl: 'https://clubedolivro.com/login',
        whatsappUrl: 'https://chat.whatsapp.com/club-do-livro'
      }
    });
  },

  // Enviar confirmação de pagamento
  async sendPaymentConfirmation(
    to: string, 
    customerName: string, 
    paymentData: {
      amount: number;
      method: string;
      transactionId: string;
      productName: string;
    }
  ): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      template: 'payment_confirmation',
      data: {
        customerName,
        customerEmail: to,
        productName: paymentData.productName,
        amount: paymentData.amount.toFixed(2),
        paymentMethod: paymentData.method,
        paymentDate: new Date().toLocaleDateString('pt-BR'),
        transactionId: paymentData.transactionId,
        loginUrl: 'https://clubedolivro.com/login'
      }
    });
  },

  // Enviar lembrete de encontro
  async sendMeetingReminder(
    to: string, 
    meetingData: {
      title: string;
      date: string;
      time: string;
      description: string;
      facilitator: string;
      meetingUrl: string;
    }
  ): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      template: 'meeting_reminder',
      data: {
        meetingTitle: meetingData.title,
        meetingDate: meetingData.date,
        meetingTime: meetingData.time,
        meetingDescription: meetingData.description,
        facilitator: meetingData.facilitator,
        meetingUrl: meetingData.meetingUrl
      }
    });
  },

  // Enviar newsletter semanal
  async sendWeeklyNewsletter(
    to: string,
    newsletterData: {
      weekOf: string;
      highlight: string;
      upcomingMeetings: Array<{title: string; date: string; time: string}>;
      trendingTopics: Array<{title: string; comments: number}>;
      reflection: string;
    }
  ): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      template: 'newsletter',
      data: {
        weekOf: newsletterData.weekOf,
        weeklyHighlight: newsletterData.highlight,
        upcomingMeetings: newsletterData.upcomingMeetings,
        trendingTopics: newsletterData.trendingTopics,
        weeklyReflection: newsletterData.reflection,
        clubUrl: 'https://clubedolivro.com/aluna'
      }
    });
  },

  // Enviar email de redefinição de senha
  async sendPasswordReset(to: string, name: string, resetToken: string): Promise<EmailResponse> {
    return this.sendEmail({
      to,
      template: 'password_reset',
      data: {
        name,
        resetUrl: `https://clubedolivro.com/nova-senha?token=${resetToken}`
      }
    });
  },

  // Verificar status de email
  async getEmailStatus(messageId: string): Promise<{
    messageId: string;
    status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced';
    timestamp: Date;
  }> {
    await delay(300);
    
    // Simular diferentes status baseado no tempo
    const statuses = ['sent', 'delivered', 'opened', 'clicked'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      messageId,
      status: randomStatus as any,
      timestamp: new Date()
    };
  },

  // Enviar email em lote
  async sendBulkEmails(requests: EmailRequest[]): Promise<EmailResponse[]> {
    await delay(2000); // Mais tempo para processamento em lote
    
    const results: EmailResponse[] = [];
    
    for (const request of requests) {
      try {
        const result = await this.sendEmail(request);
        results.push(result);
      } catch (error) {
        results.push({
          messageId: generateMessageId(),
          status: 'failed',
          timestamp: new Date(),
          to: request.to,
          subject: 'Falha no envio'
        });
      }
    }
    
    return results;
  }
};