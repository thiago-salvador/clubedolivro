import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Image,
  FileText,
  Video,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Bot,
  RefreshCw
} from 'lucide-react';
import { whatsappService } from '../../services/whatsapp.service';

interface MessageTest {
  id: string;
  type: 'text' | 'template' | 'media' | 'group' | 'interactive';
  recipient: string;
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  messageId?: string;
  cost?: number;
  error?: string;
}

interface TemplateParams {
  [key: string]: string;
}

export default function WhatsAppTester() {
  const [messageType, setMessageType] = useState<'text' | 'template' | 'media' | 'group' | 'interactive'>('text');
  const [recipient, setRecipient] = useState('');
  const [textContent, setTextContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('welcome_club');
  const [templateParams, setTemplateParams] = useState<TemplateParams>({});
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'document' | 'video'>('image');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; formatted: string; hasWhatsApp: boolean } | null>(null);
  const [testHistory, setTestHistory] = useState<MessageTest[]>([]);
  const [loading, setLoading] = useState(false);

  const templates = whatsappService.getAvailableTemplates();
  const groups = whatsappService.getGroupsInfo();

  const getTemplateParams = (templateName: string): string[] => {
    const template = templates[templateName];
    if (!template) return [];
    
    const matches = template.body.match(/\{\{\d+\}\}/g) || [];
    const params = matches.map(m => {
      const num = m.match(/\d+/)?.[0] || '1';
      switch (templateName) {
        case 'welcome_club':
          return ['Nome', 'URL Login', 'URL Área', 'Link Grupo'][parseInt(num) - 1];
        case 'payment_confirmed':
          return ['Nome', 'Valor', 'ID Transação', 'URL Área'][parseInt(num) - 1];
        case 'meeting_reminder':
          return ['Nome', 'Título', 'Horário', 'Link'][parseInt(num) - 1];
        case 'chapter_released':
          return ['Nome', 'Capítulo', 'URL'][parseInt(num) - 1];
        default:
          return `Parâmetro ${num}`;
      }
    });
    
    return params;
  };

  const validatePhone = async () => {
    if (!recipient) return;
    
    setIsValidating(true);
    try {
      const result = await whatsappService.validatePhoneNumber(recipient);
      setValidationResult(result);
      if (result.valid) {
        setRecipient(result.formatted);
      }
    } catch (error) {
      console.error('Erro ao validar telefone:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const sendTestMessage = async () => {
    if (!recipient) {
      alert('Por favor, insira o número do destinatário');
      return;
    }

    setLoading(true);
    const testId = Date.now().toString();
    const newTest: MessageTest = {
      id: testId,
      type: messageType,
      recipient,
      content: '',
      status: 'pending',
      timestamp: new Date()
    };

    try {
      let response: any;
      
      switch (messageType) {
        case 'text':
          if (!textContent) {
            alert('Por favor, insira o conteúdo da mensagem');
            setLoading(false);
            return;
          }
          newTest.content = textContent;
          response = await whatsappService.sendTextMessage(recipient, textContent);
          break;
          
        case 'template':
          const params = Object.values(templateParams);
          newTest.content = `Template: ${selectedTemplate}`;
          response = await whatsappService.sendTemplate(recipient, selectedTemplate, params);
          break;
          
        case 'media':
          if (!mediaUrl) {
            alert('Por favor, insira a URL da mídia');
            setLoading(false);
            return;
          }
          newTest.content = `${mediaType}: ${mediaUrl}`;
          response = await whatsappService.sendMedia(recipient, mediaUrl, mediaType, textContent);
          break;
          
        case 'group':
          newTest.content = 'Convite para grupo principal';
          response = await whatsappService.sendGroupInvite(recipient, 'main_group');
          break;
          
        case 'interactive':
          newTest.content = 'Mensagem interativa de suporte';
          response = await whatsappService.sendSupportMessage(recipient);
          break;
      }

      newTest.status = 'sent';
      newTest.messageId = response.messageId;
      newTest.cost = response.cost;
      
      setTestHistory([newTest, ...testHistory]);
      
      // Simular atualização de status
      setTimeout(async () => {
        if (response.messageId) {
          const statusUpdate = await whatsappService.getMessageStatus(response.messageId);
          setTestHistory(prev => 
            prev.map(t => t.id === testId ? { ...t, status: statusUpdate.status } : t)
          );
        }
      }, 3000);
      
    } catch (error: any) {
      newTest.status = 'failed';
      newTest.error = error.message;
      setTestHistory([newTest, ...testHistory]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'read':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tipo de Mensagem */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Tipo de Mensagem</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <button
            onClick={() => setMessageType('text')}
            className={`p-3 rounded-lg border-2 transition-all ${
              messageType === 'text'
                ? 'border-terracota bg-terracota/10'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <MessageSquare className="h-5 w-5 mx-auto mb-1" />
            <span className="text-xs">Texto</span>
          </button>
          <button
            onClick={() => setMessageType('template')}
            className={`p-3 rounded-lg border-2 transition-all ${
              messageType === 'template'
                ? 'border-terracota bg-terracota/10'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <FileText className="h-5 w-5 mx-auto mb-1" />
            <span className="text-xs">Template</span>
          </button>
          <button
            onClick={() => setMessageType('media')}
            className={`p-3 rounded-lg border-2 transition-all ${
              messageType === 'media'
                ? 'border-terracota bg-terracota/10'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <Image className="h-5 w-5 mx-auto mb-1" />
            <span className="text-xs">Mídia</span>
          </button>
          <button
            onClick={() => setMessageType('group')}
            className={`p-3 rounded-lg border-2 transition-all ${
              messageType === 'group'
                ? 'border-terracota bg-terracota/10'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <Users className="h-5 w-5 mx-auto mb-1" />
            <span className="text-xs">Grupo</span>
          </button>
          <button
            onClick={() => setMessageType('interactive')}
            className={`p-3 rounded-lg border-2 transition-all ${
              messageType === 'interactive'
                ? 'border-terracota bg-terracota/10'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <Bot className="h-5 w-5 mx-auto mb-1" />
            <span className="text-xs">Interativa</span>
          </button>
        </div>
      </div>

      {/* Destinatário */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Destinatário</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                onBlur={validatePhone}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <button
              onClick={validatePhone}
              disabled={isValidating}
              className="px-4 py-2 bg-verde-oliva text-white rounded-lg hover:bg-verde-floresta disabled:opacity-50"
            >
              {isValidating ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Phone className="h-5 w-5" />
              )}
            </button>
          </div>
          
          {validationResult && (
            <div className={`p-3 rounded-lg ${
              validationResult.valid && validationResult.hasWhatsApp
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}>
              {validationResult.valid ? (
                validationResult.hasWhatsApp ? (
                  <p className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Número válido com WhatsApp: {validationResult.formatted}
                  </p>
                ) : (
                  <p className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Número válido mas sem WhatsApp: {validationResult.formatted}
                  </p>
                )
              ) : (
                <p className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Número inválido
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo da Mensagem */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Conteúdo</h3>
        
        {messageType === 'text' && (
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Digite sua mensagem..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
        )}
        
        {messageType === 'template' && (
          <div className="space-y-4">
            <select
              value={selectedTemplate}
              onChange={(e) => {
                setSelectedTemplate(e.target.value);
                setTemplateParams({});
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              {Object.entries(templates).map(([key, template]) => (
                <option key={key} value={key}>
                  {template.header || template.name}
                </option>
              ))}
            </select>
            
            <div className="space-y-2">
              {getTemplateParams(selectedTemplate).map((param, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={param}
                  value={templateParams[index] || ''}
                  onChange={(e) => setTemplateParams({
                    ...templateParams,
                    [index]: e.target.value
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              ))}
            </div>
            
            {templates[selectedTemplate] && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="text-sm whitespace-pre-wrap">
                  {templates[selectedTemplate].header && (
                    <p className="font-semibold">{templates[selectedTemplate].header}</p>
                  )}
                  <p>{templates[selectedTemplate].body}</p>
                  {templates[selectedTemplate].footer && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {templates[selectedTemplate].footer}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {messageType === 'media' && (
          <div className="space-y-4">
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as 'image' | 'document' | 'video')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="image">Imagem</option>
              <option value="document">Documento</option>
              <option value="video">Vídeo</option>
            </select>
            
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="URL da mídia"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
            
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Legenda (opcional)"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
        )}
        
        {messageType === 'group' && (
          <div className="space-y-4">
            {Object.entries(groups).map(([key, group]) => (
              <div key={key} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold">{group.groupName}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {group.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  👥 {group.memberCount} membros
                </p>
              </div>
            ))}
          </div>
        )}
        
        {messageType === 'interactive' && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm mb-2">Mensagem de suporte automática com opções:</p>
            <ol className="text-sm space-y-1">
              <li>1️⃣ Problemas de acesso</li>
              <li>2️⃣ Dúvidas sobre pagamento</li>
              <li>3️⃣ Informações sobre encontros</li>
              <li>4️⃣ Falar com atendente humano</li>
            </ol>
          </div>
        )}
      </div>

      {/* Botão de Envio */}
      <div className="flex justify-end">
        <button
          onClick={sendTestMessage}
          disabled={loading || !recipient}
          className="px-6 py-3 bg-terracota text-white rounded-lg hover:bg-terracota/80 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Enviar Teste
            </>
          )}
        </button>
      </div>

      {/* Histórico de Testes */}
      {testHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Histórico de Testes</h3>
          <div className="space-y-3">
            {testHistory.map((test) => (
              <div
                key={test.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(test.status)}
                    <span className="font-medium">{test.type}</span>
                    <span className="text-sm text-gray-500">
                      para {test.recipient}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {test.content}
                  </p>
                  {test.error && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      Erro: {test.error}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {test.timestamp.toLocaleTimeString()}
                  </p>
                  {test.cost && (
                    <p className="text-xs text-gray-400">
                      R$ {(test.cost / 100).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}