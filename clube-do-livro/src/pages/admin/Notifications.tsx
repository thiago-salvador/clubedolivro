import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Mail, 
  Users, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import { notificationService, NotificationTemplate, ScheduledNotification } from '../../services/notification.service';
import { studentService, StudentWithTags } from '../../services/student.service';
import { tagService } from '../../services/tag.service';

interface EmailDraft {
  id?: string;
  subject: string;
  body: string;
  recipientType: 'all' | 'active' | 'inactive' | 'tag' | 'custom';
  selectedTags: string[];
  customEmails: string;
  scheduledFor?: Date;
  templateType?: string;
}

const Notifications: React.FC = () => {
  // Estados principais
  const [activeTab, setActiveTab] = useState<'send' | 'templates' | 'queue' | 'stats'>('send');
  const [emailDraft, setEmailDraft] = useState<EmailDraft>({
    subject: '',
    body: '',
    recipientType: 'all',
    selectedTags: [],
    customEmails: ''
  });
  
  // Estados para templates
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  
  // Estados para fila de notificações
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [queueStats, setQueueStats] = useState({ total: 0, pending: 0, sent: 0 });
  
  // Estados de controle
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [recipients, setRecipients] = useState<StudentWithTags[]>([]);
  const [recipientCount, setRecipientCount] = useState(0);

  // Carregar dados iniciais
  useEffect(() => {
    loadTemplates();
    loadQueueData();
    loadRecipients();
  }, []);

  // Atualizar contagem de destinatários quando filtros mudarem
  useEffect(() => {
    updateRecipientCount();
  }, [emailDraft.recipientType, emailDraft.selectedTags, emailDraft.customEmails, recipients]);

  const loadTemplates = () => {
    const storedTemplates = localStorage.getItem('notification_templates');
    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates));
    }
  };

  const loadQueueData = () => {
    setScheduledNotifications(notificationService.getUpcomingNotifications(50));
    setQueueStats(notificationService.getQueueStats());
  };

  const loadRecipients = async () => {
    const students = await studentService.getAllStudents();
    setRecipients(students);
  };

  const updateRecipientCount = () => {
    let count = 0;
    
    switch (emailDraft.recipientType) {
      case 'all':
        count = recipients.length;
        break;
      case 'active':
        count = recipients.filter(s => s.isActive).length;
        break;
      case 'inactive':
        count = recipients.filter(s => !s.isActive).length;
        break;
      case 'tag':
        if (emailDraft.selectedTags.length > 0) {
          count = recipients.filter(s => 
            s.tags.some(tag => emailDraft.selectedTags.includes(tag.id))
          ).length;
        }
        break;
      case 'custom':
        count = emailDraft.customEmails.split(',').filter(email => email.trim()).length;
        break;
    }
    
    setRecipientCount(count);
  };

  const handleSendEmail = async () => {
    if (!emailDraft.subject || !emailDraft.body) {
      alert('Preencha o assunto e o corpo do email');
      return;
    }

    if (recipientCount === 0) {
      alert('Selecione pelo menos um destinatário');
      return;
    }

    setIsLoading(true);

    try {
      // Simular envio de email
      // Em produção, isso seria um endpoint da API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Criar notificação na fila se for agendada
      if (emailDraft.scheduledFor) {
        const notification: Omit<ScheduledNotification, 'id' | 'createdAt'> = {
          type: 'digest',
          userId: 'admin',
          scheduledFor: emailDraft.scheduledFor,
          title: emailDraft.subject,
          message: emailDraft.body.substring(0, 100) + '...',
          sent: false,
          data: {
            recipientType: emailDraft.recipientType,
            selectedTags: emailDraft.selectedTags,
            customEmails: emailDraft.customEmails,
            recipientCount
          }
        };

        notificationService.scheduleCustomNotification(
          notification.type,
          notification.userId,
          notification.scheduledFor,
          notification.title,
          notification.message,
          notification.data
        );
      }

      alert(`Email ${emailDraft.scheduledFor ? 'agendado' : 'enviado'} com sucesso para ${recipientCount} destinatários!`);
      
      // Reset form
      setEmailDraft({
        subject: '',
        body: '',
        recipientType: 'all',
        selectedTags: [],
        customEmails: ''
      });
      
      loadQueueData();
      
    } catch (error) {
      alert('Erro ao enviar email: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (template: NotificationTemplate) => {
    setEmailDraft(prev => ({
      ...prev,
      subject: template.subject,
      body: template.body,
      templateType: template.type
    }));
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    const existingTemplates = JSON.parse(localStorage.getItem('notification_templates') || '[]');
    const templateIndex = existingTemplates.findIndex((t: NotificationTemplate) => t.type === editingTemplate.type);
    
    if (templateIndex >= 0) {
      existingTemplates[templateIndex] = editingTemplate;
    } else {
      existingTemplates.push(editingTemplate);
    }
    
    localStorage.setItem('notification_templates', JSON.stringify(existingTemplates));
    loadTemplates();
    setShowTemplateModal(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateType: string) => {
    if (window.confirm('Tem certeza que deseja excluir este template?')) {
      const existingTemplates = JSON.parse(localStorage.getItem('notification_templates') || '[]');
      const filteredTemplates = existingTemplates.filter((t: NotificationTemplate) => t.type !== templateType);
      localStorage.setItem('notification_templates', JSON.stringify(filteredTemplates));
      loadTemplates();
    }
  };

  const renderSendTab = () => (
    <div className="space-y-6">
      {/* Seleção de destinatários */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-terracota" />
          Destinatários
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de destinatários
            </label>
            <select
              value={emailDraft.recipientType}
              onChange={(e) => setEmailDraft(prev => ({ ...prev, recipientType: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracota dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todas as alunas</option>
              <option value="active">Apenas alunas ativas</option>
              <option value="inactive">Apenas alunas inativas</option>
              <option value="tag">Por tags</option>
              <option value="custom">Lista personalizada</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="bg-terracota/10 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Destinatários selecionados:
              </span>
              <span className="ml-2 text-lg font-semibold text-terracota">
                {recipientCount}
              </span>
            </div>
          </div>
        </div>

        {/* Seleção de tags */}
        {emailDraft.recipientType === 'tag' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Selecionar tags
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tagService.getAllTags().map(tag => (
                <label key={tag.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={emailDraft.selectedTags.includes(tag.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEmailDraft(prev => ({
                          ...prev,
                          selectedTags: [...prev.selectedTags, tag.id]
                        }));
                      } else {
                        setEmailDraft(prev => ({
                          ...prev,
                          selectedTags: prev.selectedTags.filter(id => id !== tag.id)
                        }));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{tag.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Lista personalizada */}
        {emailDraft.recipientType === 'custom' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Emails (separados por vírgula)
            </label>
            <textarea
              value={emailDraft.customEmails}
              onChange={(e) => setEmailDraft(prev => ({ ...prev, customEmails: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracota dark:bg-gray-700 dark:text-white"
              placeholder="email1@example.com, email2@example.com..."
            />
          </div>
        )}
      </div>

      {/* Composição do email */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Mail className="w-5 h-5 mr-2 text-terracota" />
            Composição do Email
          </h3>
          
          <div className="space-x-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              {previewMode ? 'Editar' : 'Preview'}
            </button>
          </div>
        </div>

        {/* Templates */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Usar template
          </label>
          <select
            onChange={(e) => {
              const template = templates.find(t => t.type === e.target.value);
              if (template) handleTemplateSelect(template);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracota dark:bg-gray-700 dark:text-white"
          >
            <option value="">Selecionar template...</option>
            {templates.map(template => (
              <option key={template.type} value={template.type}>
                {template.type.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assunto
            </label>
            <input
              type="text"
              value={emailDraft.subject}
              onChange={(e) => setEmailDraft(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracota dark:bg-gray-700 dark:text-white"
              placeholder="Assunto do email..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Corpo do email
            </label>
            {previewMode ? (
              <div className="w-full min-h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: emailDraft.body.replace(/\n/g, '<br>') }} />
                </div>
              </div>
            ) : (
              <textarea
                value={emailDraft.body}
                onChange={(e) => setEmailDraft(prev => ({ ...prev, body: e.target.value }))}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracota dark:bg-gray-700 dark:text-white"
                placeholder="Corpo do email..."
              />
            )}
          </div>

          {/* Agendamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Agendamento (opcional)
            </label>
            <input
              type="datetime-local"
              value={emailDraft.scheduledFor ? emailDraft.scheduledFor.toISOString().slice(0, 16) : ''}
              onChange={(e) => setEmailDraft(prev => ({ 
                ...prev, 
                scheduledFor: e.target.value ? new Date(e.target.value) : undefined 
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracota dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setEmailDraft({
              subject: '',
              body: '',
              recipientType: 'all',
              selectedTags: [],
              customEmails: ''
            })}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Limpar
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isLoading || !emailDraft.subject || !emailDraft.body || recipientCount === 0}
            className="px-6 py-2 bg-terracota text-white rounded-md hover:bg-terracota/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {emailDraft.scheduledFor ? 'Agendar' : 'Enviar'} Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Templates de Email
        </h3>
        <button
          onClick={() => {
            setEditingTemplate({
              type: '',
              subject: '',
              body: '',
              variables: []
            });
            setShowTemplateModal(true);
          }}
          className="px-4 py-2 bg-terracota text-white rounded-md hover:bg-terracota/90 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </button>
      </div>

      <div className="grid gap-4">
        {templates.map(template => (
          <div key={template.type} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-terracota">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {template.type.replace('_', ' ').toUpperCase()}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {template.subject}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Variáveis: {template.variables.join(', ')}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setEditingTemplate(template);
                    setShowTemplateModal(true);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-terracota"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.type)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edição de template */}
      {showTemplateModal && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingTemplate.type ? 'Editar Template' : 'Novo Template'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo do Template
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.type}
                    onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, type: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracota dark:bg-gray-700 dark:text-white"
                    placeholder="ex: welcome_email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assunto
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.subject}
                    onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, subject: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracota dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Corpo do Template
                  </label>
                  <textarea
                    value={editingTemplate.body}
                    onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, body: e.target.value } : null)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracota dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Variáveis (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.variables.join(', ')}
                    onChange={(e) => setEditingTemplate(prev => prev ? { 
                      ...prev, 
                      variables: e.target.value.split(',').map(v => v.trim()).filter(v => v)
                    } : null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracota dark:bg-gray-700 dark:text-white"
                    placeholder="name, email, title"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setEditingTemplate(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-6 py-2 bg-terracota text-white rounded-md hover:bg-terracota/90"
                >
                  Salvar Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderQueueTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-terracota mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{queueStats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enviadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{queueStats.sent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{queueStats.total}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notificações Agendadas
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {scheduledNotifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Nenhuma notificação agendada
            </div>
          ) : (
            scheduledNotifications.map(notification => (
              <div key={notification.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-xs text-gray-400">
                        Agendado para: {new Date(notification.scheduledFor).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        Tipo: {notification.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {notification.sent ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-terracota" />
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm('Cancelar esta notificação?')) {
                          notificationService.cancelNotification(notification.id);
                          loadQueueData();
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Sistema de Notificações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie emails, templates e notificações para as alunas
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 p-6">
            {[
              { id: 'send', label: 'Enviar Email', icon: Send },
              { id: 'templates', label: 'Templates', icon: Edit },
              { id: 'queue', label: 'Fila de Envio', icon: Clock },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'text-terracota bg-terracota/10'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'send' && renderSendTab()}
          {activeTab === 'templates' && renderTemplatesTab()}
          {activeTab === 'queue' && renderQueueTab()}
        </div>
      </div>
    </div>
  );
};

export default Notifications;