// Simulação da WhatsApp Business API
// Este arquivo pode ser facilmente substituído pela integração real com WhatsApp Business API

interface WhatsAppMessage {
  to: string; // Número no formato +55DDNNNNNNNNN
  type: 'text' | 'template' | 'interactive' | 'media';
  content: {
    text?: string;
    templateName?: string;
    templateParams?: string[];
    mediaUrl?: string;
    mediaType?: 'image' | 'document' | 'video';
    buttons?: Array<{
      id: string;
      title: string;
      url?: string;
    }>;
  };
}

interface WhatsAppResponse {
  messageId: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  to: string;
  cost?: number; // Custo em centavos
}

interface GroupInvite {
  groupName: string;
  description: string;
  inviteLink: string;
  memberCount: number;
  isActive: boolean;
}

interface WhatsAppTemplate {
  name: string;
  category: 'marketing' | 'utility' | 'authentication';
  language: string;
  header?: string;
  body: string;
  footer?: string;
  buttons?: Array<{
    type: 'url' | 'phone_number' | 'quick_reply';
    text: string;
    url?: string;
    phone_number?: string;
  }>;
}

// Templates pré-aprovados (simulando templates reais da WhatsApp Business API)
const WHATSAPP_TEMPLATES: Record<string, WhatsAppTemplate> = {
  welcome_club: {
    name: 'welcome_club',
    category: 'utility',
    language: 'pt_BR',
    header: '🌟 Bem-vinda ao Clube do Livro!',
    body: 'Olá {{1}}! Seja muito bem-vinda ao nosso círculo sagrado. Sua jornada de autoconhecimento com "Mulheres que Correm com os Lobos" começa agora. Acesse sua área: {{2}}',
    footer: 'Clube do Livro 💜',
    buttons: [
      { type: 'url', text: 'Acessar Área da Aluna', url: '{{3}}' },
      { type: 'url', text: 'Grupo WhatsApp', url: '{{4}}' }
    ]
  },
  
  payment_confirmed: {
    name: 'payment_confirmed',
    category: 'utility',
    language: 'pt_BR',
    header: '✅ Pagamento Confirmado',
    body: 'Oi {{1}}! Seu pagamento de R$ {{2}} foi confirmado. Você já tem acesso completo ao clube. ID: {{3}}',
    footer: 'Dúvidas? Responda esta mensagem',
    buttons: [
      { type: 'url', text: 'Entrar no Clube', url: '{{4}}' }
    ]
  },
  
  meeting_reminder: {
    name: 'meeting_reminder',
    category: 'utility',
    language: 'pt_BR',
    header: '📅 Encontro Hoje!',
    body: 'Oi {{1}}! Lembrete: {{2}} hoje às {{3}}. Nos vemos lá! Link: {{4}}',
    footer: 'Te esperamos 💜',
    buttons: [
      { type: 'url', text: 'Entrar na Sala', url: '{{4}}' }
    ]
  },
  
  chapter_released: {
    name: 'chapter_released',
    category: 'marketing',
    language: 'pt_BR',
    header: '📚 Novo Capítulo Disponível!',
    body: 'Oi {{1}}! O {{2}} já está disponível na sua área. Não perca os exercícios terapêuticos e o encontro desta semana!',
    footer: 'Boa jornada 🌙',
    buttons: [
      { type: 'url', text: 'Ver Capítulo', url: '{{3}}' }
    ]
  },
  
  support_available: {
    name: 'support_available',
    category: 'utility',
    language: 'pt_BR',
    body: 'Olá! Sou a assistente do Clube do Livro 🌟 Como posso te ajudar hoje? Responda com uma das opções:\n\n1️⃣ Problemas de acesso\n2️⃣ Dúvidas sobre pagamento\n3️⃣ Informações sobre encontros\n4️⃣ Falar com atendente humano',
    footer: 'Estamos aqui para você! 💜'
  }
};

// Grupos ativos do WhatsApp
const WHATSAPP_GROUPS: Record<string, GroupInvite> = {
  main_group: {
    groupName: 'Clube do Livro - Mulheres que Correm 🐺',
    description: 'Nosso círculo sagrado para compartilhar a jornada de autoconhecimento',
    inviteLink: 'https://chat.whatsapp.com/ClubeDeLivroMulheresLobos2025',
    memberCount: 127,
    isActive: true
  },
  announcements: {
    groupName: 'Clube do Livro - Avisos 📢',
    description: 'Apenas avisos importantes e lembretes',
    inviteLink: 'https://chat.whatsapp.com/ClubeLivroAvisos2025',
    memberCount: 98,
    isActive: true
  },
  exercises: {
    groupName: 'Clube do Livro - Exercícios Terapêuticos ✍️',
    description: 'Compartilhe suas reflexões e exercícios (opcional)',
    inviteLink: 'https://chat.whatsapp.com/ClubeLivroExercicios2025',
    memberCount: 73,
    isActive: true
  }
};

// Simular delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Gerar ID único para mensagem
const generateMessageId = (): string => {
  return `wamid.${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
};

// Formatar número de telefone
const formatPhoneNumber = (phone: string): string => {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Adiciona código do país se não tiver
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `+55${cleaned.substring(1)}`;
  } else if (cleaned.length === 11) {
    return `+55${cleaned}`;
  } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
    return `+${cleaned}`;
  }
  
  return `+${cleaned}`;
};

// Renderizar template com parâmetros
const renderTemplate = (template: WhatsAppTemplate, params: string[]): string => {
  let message = template.body;
  
  params.forEach((param, index) => {
    const placeholder = `{{${index + 1}}}`;
    message = message.replace(new RegExp(placeholder, 'g'), param);
  });
  
  return message;
};

export const whatsappService = {
  // Enviar mensagem de texto simples
  async sendTextMessage(to: string, text: string): Promise<WhatsAppResponse> {
    await delay(800);
    
    const formattedPhone = formatPhoneNumber(to);
    const messageId = generateMessageId();
    
    // Simular falha ocasional (3% de chance)
    if (Math.random() < 0.03) {
      throw new Error('Falha ao enviar mensagem WhatsApp');
    }
    
    console.log('📱 WhatsApp enviado:', {
      to: formattedPhone,
      messageId,
      type: 'text',
      content: text.substring(0, 50) + '...',
      timestamp: new Date()
    });
    
    return {
      messageId,
      status: 'sent',
      timestamp: new Date(),
      to: formattedPhone,
      cost: 15 // 15 centavos por mensagem
    };
  },

  // Enviar template de mensagem
  async sendTemplate(
    to: string, 
    templateName: string, 
    params: string[]
  ): Promise<WhatsAppResponse> {
    await delay(1000);
    
    const template = WHATSAPP_TEMPLATES[templateName];
    if (!template) {
      throw new Error(`Template '${templateName}' não encontrado`);
    }
    
    const formattedPhone = formatPhoneNumber(to);
    const messageId = generateMessageId();
    
    console.log('📱 WhatsApp template enviado:', {
      to: formattedPhone,
      messageId,
      template: templateName,
      params,
      timestamp: new Date()
    });
    
    return {
      messageId,
      status: 'sent',
      timestamp: new Date(),
      to: formattedPhone,
      cost: 25 // Templates custam mais
    };
  },

  // Enviar mensagem interativa com botões
  async sendInteractiveMessage(
    to: string,
    text: string,
    buttons: Array<{ id: string; title: string; url?: string }>
  ): Promise<WhatsAppResponse> {
    await delay(1200);
    
    const formattedPhone = formatPhoneNumber(to);
    const messageId = generateMessageId();
    
    console.log('📱 WhatsApp interativo enviado:', {
      to: formattedPhone,
      messageId,
      buttonsCount: buttons.length,
      timestamp: new Date()
    });
    
    return {
      messageId,
      status: 'sent',
      timestamp: new Date(),
      to: formattedPhone,
      cost: 35 // Mensagens interativas custam mais
    };
  },

  // Enviar mídia (imagem, documento, etc.)
  async sendMedia(
    to: string,
    mediaUrl: string,
    mediaType: 'image' | 'document' | 'video',
    caption?: string
  ): Promise<WhatsAppResponse> {
    await delay(1500);
    
    const formattedPhone = formatPhoneNumber(to);
    const messageId = generateMessageId();
    
    console.log('📱 WhatsApp mídia enviada:', {
      to: formattedPhone,
      messageId,
      mediaType,
      mediaUrl,
      caption,
      timestamp: new Date()
    });
    
    return {
      messageId,
      status: 'sent',
      timestamp: new Date(),
      to: formattedPhone,
      cost: 30
    };
  },

  // Enviar convite para grupo
  async sendGroupInvite(to: string, groupKey: string = 'main_group'): Promise<WhatsAppResponse> {
    const group = WHATSAPP_GROUPS[groupKey];
    if (!group || !group.isActive) {
      throw new Error('Grupo não encontrado ou inativo');
    }
    
    const message = `🌟 *${group.groupName}*\n\n${group.description}\n\n👥 ${group.memberCount} membros\n\n🔗 Clique para entrar: ${group.inviteLink}`;
    
    return this.sendTextMessage(to, message);
  },

  // Enviar boas-vindas após compra
  async sendWelcomeMessage(to: string, customerName: string): Promise<WhatsAppResponse> {
    return this.sendTemplate(to, 'welcome_club', [
      customerName,
      'https://clubedolivro.com/login',
      'https://clubedolivro.com/aluna',
      WHATSAPP_GROUPS.main_group.inviteLink
    ]);
  },

  // Enviar confirmação de pagamento
  async sendPaymentConfirmation(
    to: string, 
    customerName: string, 
    amount: number, 
    transactionId: string
  ): Promise<WhatsAppResponse> {
    return this.sendTemplate(to, 'payment_confirmed', [
      customerName,
      amount.toFixed(2),
      transactionId,
      'https://clubedolivro.com/aluna'
    ]);
  },

  // Enviar lembrete de encontro
  async sendMeetingReminder(
    to: string,
    customerName: string,
    meetingTitle: string,
    meetingTime: string,
    meetingUrl: string
  ): Promise<WhatsAppResponse> {
    return this.sendTemplate(to, 'meeting_reminder', [
      customerName,
      meetingTitle,
      meetingTime,
      meetingUrl
    ]);
  },

  // Enviar notificação de novo capítulo
  async sendChapterNotification(
    to: string,
    customerName: string,
    chapterName: string,
    chapterUrl: string
  ): Promise<WhatsAppResponse> {
    return this.sendTemplate(to, 'chapter_released', [
      customerName,
      chapterName,
      chapterUrl
    ]);
  },

  // Iniciar atendimento de suporte
  async sendSupportMessage(to: string): Promise<WhatsAppResponse> {
    return this.sendTemplate(to, 'support_available', []);
  },

  // Enviar mensagem em lote
  async sendBulkMessages(
    recipients: string[],
    templateName: string,
    paramsGenerator: (phone: string) => string[]
  ): Promise<WhatsAppResponse[]> {
    await delay(2000);
    
    const results: WhatsAppResponse[] = [];
    
    for (const phone of recipients) {
      try {
        const params = paramsGenerator(phone);
        const result = await this.sendTemplate(phone, templateName, params);
        results.push(result);
        
        // Delay entre mensagens para respeitar rate limits
        await delay(200);
      } catch (error) {
        console.error(`Erro ao enviar para ${phone}:`, error);
        results.push({
          messageId: generateMessageId(),
          status: 'failed',
          timestamp: new Date(),
          to: formatPhoneNumber(phone),
          cost: 0
        });
      }
    }
    
    return results;
  },

  // Verificar status de mensagem
  async getMessageStatus(messageId: string): Promise<{
    messageId: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: Date;
    deliveredAt?: Date;
    readAt?: Date;
  }> {
    await delay(300);
    
    // Simular progressão de status baseada no tempo
    const now = new Date();
    const sentTime = new Date(now.getTime() - Math.random() * 300000); // Enviado nos últimos 5 min
    const deliveredTime = new Date(sentTime.getTime() + Math.random() * 60000); // Entregue até 1 min depois
    const readTime = new Date(deliveredTime.getTime() + Math.random() * 180000); // Lido até 3 min depois
    
    let status: 'sent' | 'delivered' | 'read' | 'failed' = 'sent';
    let deliveredAt: Date | undefined;
    let readAt: Date | undefined;
    
    if (deliveredTime <= now) {
      status = 'delivered';
      deliveredAt = deliveredTime;
      
      if (readTime <= now && Math.random() > 0.3) { // 70% chance de ter sido lida
        status = 'read';
        readAt = readTime;
      }
    }
    
    return {
      messageId,
      status,
      timestamp: sentTime,
      deliveredAt,
      readAt
    };
  },

  // Obter informações dos grupos
  getGroupsInfo(): Record<string, GroupInvite> {
    return { ...WHATSAPP_GROUPS };
  },

  // Obter templates disponíveis
  getAvailableTemplates(): Record<string, WhatsAppTemplate> {
    return { ...WHATSAPP_TEMPLATES };
  },

  // Gerar link de atendimento direto
  generateSupportLink(phone: string, message: string = 'Olá! Preciso de ajuda com o Clube do Livro.'): string {
    const formattedPhone = formatPhoneNumber(phone).replace('+', '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  },

  // Validar número de WhatsApp
  async validatePhoneNumber(phone: string): Promise<{
    valid: boolean;
    formatted: string;
    hasWhatsApp: boolean;
  }> {
    await delay(500);
    
    const formatted = formatPhoneNumber(phone);
    const valid = /^\+55\d{11}$/.test(formatted);
    
    // Simular verificação de WhatsApp (90% dos números válidos têm WhatsApp)
    const hasWhatsApp = valid && Math.random() > 0.1;
    
    return {
      valid,
      formatted,
      hasWhatsApp
    };
  },

  // Webhook para receber mensagens (simulado)
  handleIncomingMessage(webhookData: {
    from: string;
    message: string;
    messageId: string;
    timestamp: Date;
  }): Promise<{ reply?: string; action?: string }> {
    return new Promise(resolve => {
      // Simular processamento de mensagem recebida
      const message = webhookData.message.toLowerCase();
      
      let reply: string | undefined;
      let action: string | undefined;
      
      if (message.includes('acesso') || message.includes('login')) {
        reply = 'Para acessar sua área da aluna, use este link: https://clubedolivro.com/login\n\nSe esqueceu sua senha, clique em "Esqueci minha senha" na tela de login.';
        action = 'send_access_info';
      } else if (message.includes('pagamento') || message.includes('cobrança')) {
        reply = 'Para questões sobre pagamento, nossa equipe financeira irá entrar em contato. Qual o melhor horário para te ligar?';
        action = 'escalate_to_billing';
      } else if (message.includes('encontro') || message.includes('reunião')) {
        reply = 'Os próximos encontros estão na sua área da aluna. Também enviamos lembretes por WhatsApp 2h antes de cada encontro!';
        action = 'send_meeting_info';
      } else if (/^[1-4]$/.test(message)) {
        const responses = {
          '1': 'Vou te ajudar com problemas de acesso! Use o link: https://clubedolivro.com/login',
          '2': 'Nossa equipe financeira irá te auxiliar. Em qual horário posso pedir para te ligarem?',
          '3': 'Os encontros estão na sua área da aluna: https://clubedolivro.com/aluna',
          '4': 'Conectando você com um atendente humano. Aguarde um momento...'
        };
        reply = responses[message as '1'|'2'|'3'|'4'];
        action = `option_${message}`;
      } else {
        reply = 'Não entendi sua mensagem. Digite uma das opções:\n\n1️⃣ Problemas de acesso\n2️⃣ Dúvidas sobre pagamento\n3️⃣ Informações sobre encontros\n4️⃣ Falar com atendente humano';
        action = 'show_menu';
      }
      
      setTimeout(() => resolve({ reply, action }), 500);
    });
  }
};