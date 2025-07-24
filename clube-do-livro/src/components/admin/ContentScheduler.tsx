import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, Check, X, Eye, EyeOff } from 'lucide-react';
import { CourseContent, ContentType } from '../../types/admin.types';

interface ContentSchedulerProps {
  content: CourseContent;
  onUpdate: (content: CourseContent) => void;
  onCancel?: () => void;
  inline?: boolean;
}

interface ScheduleSettings {
  publishDate: string;
  publishTime: string;
  unpublishDate?: string;
  unpublishTime?: string;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  recurringDays?: number[];
  recurringEndDate?: string;
  notifyStudents: boolean;
  notifyHoursBefore: number;
}

const ContentScheduler: React.FC<ContentSchedulerProps> = ({
  content,
  onUpdate,
  onCancel,
  inline = false
}) => {
  const [isExpanded, setIsExpanded] = useState(!inline);
  const [settings, setSettings] = useState<ScheduleSettings>({
    publishDate: '',
    publishTime: '09:00',
    unpublishDate: '',
    unpublishTime: '23:59',
    isRecurring: false,
    recurringPattern: 'weekly',
    recurringDays: [1], // Monday
    recurringEndDate: '',
    notifyStudents: true,
    notifyHoursBefore: 24
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (content.scheduledDate) {
      const date = new Date(content.scheduledDate);
      setSettings(prev => ({
        ...prev,
        publishDate: date.toISOString().split('T')[0],
        publishTime: date.toTimeString().slice(0, 5)
      }));
    }
  }, [content]);

  const weekDays = [
    { value: 0, label: 'Dom' },
    { value: 1, label: 'Seg' },
    { value: 2, label: 'Ter' },
    { value: 3, label: 'Qua' },
    { value: 4, label: 'Qui' },
    { value: 5, label: 'Sex' },
    { value: 6, label: 'Sáb' }
  ];

  const validateSettings = (): boolean => {
    const newErrors: Record<string, string> = {};
    const now = new Date();
    
    if (!settings.publishDate) {
      newErrors.publishDate = 'Data de publicação é obrigatória';
    } else {
      const publishDateTime = new Date(`${settings.publishDate}T${settings.publishTime}`);
      if (publishDateTime < now) {
        newErrors.publishDate = 'Data de publicação deve ser futura';
      }
    }

    if (settings.unpublishDate) {
      const unpublishDateTime = new Date(`${settings.unpublishDate}T${settings.unpublishTime}`);
      const publishDateTime = new Date(`${settings.publishDate}T${settings.publishTime}`);
      
      if (unpublishDateTime <= publishDateTime) {
        newErrors.unpublishDate = 'Data de despublicação deve ser posterior à publicação';
      }
    }

    if (settings.isRecurring) {
      if (!settings.recurringEndDate) {
        newErrors.recurringEndDate = 'Data de término é obrigatória para conteúdo recorrente';
      }
      
      if (settings.recurringPattern === 'weekly' && settings.recurringDays?.length === 0) {
        newErrors.recurringDays = 'Selecione pelo menos um dia da semana';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateSettings()) {
      return;
    }

    const publishDateTime = new Date(`${settings.publishDate}T${settings.publishTime}`);
    
    const updatedContent: CourseContent = {
      ...content,
      scheduledDate: publishDateTime,
      isRequired: false, // Scheduled content starts as not published
      updatedAt: new Date()
    };

    // Store additional scheduling metadata in a custom field
    // In a real implementation, this would be stored in a separate scheduling table
    (updatedContent as any).schedulingMetadata = {
      unpublishDate: settings.unpublishDate ? new Date(`${settings.unpublishDate}T${settings.unpublishTime}`) : null,
      isRecurring: settings.isRecurring,
      recurringPattern: settings.recurringPattern,
      recurringDays: settings.recurringDays,
      recurringEndDate: settings.recurringEndDate ? new Date(settings.recurringEndDate) : null,
      notifyStudents: settings.notifyStudents,
      notifyHoursBefore: settings.notifyHoursBefore
    };

    onUpdate(updatedContent);
  };

  const handleCancel = () => {
    if (inline) {
      setIsExpanded(false);
    } else if (onCancel) {
      onCancel();
    }
  };

  const getContentTypeLabel = (type: ContentType): string => {
    const labels: Record<ContentType, string> = {
      [ContentType.VIDEO]: 'Vídeo',
      [ContentType.AUDIO]: 'Áudio',
      [ContentType.TEXT]: 'Texto',
      [ContentType.EXERCISE]: 'Exercício',
      [ContentType.MEETING]: 'Encontro'
    };
    return labels[type] || 'Conteúdo';
  };

  const getScheduleStatus = (): { label: string; color: string } => {
    if (!content.scheduledDate) {
      return { label: 'Não agendado', color: 'text-gray-500' };
    }

    const now = new Date();
    const scheduledDate = new Date(content.scheduledDate);

    if (scheduledDate > now) {
      const hoursUntil = Math.floor((scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60));
      if (hoursUntil < 24) {
        return { label: `Publicação em ${hoursUntil}h`, color: 'text-yellow-600' };
      }
      return { label: `Agendado para ${scheduledDate.toLocaleDateString('pt-BR')}`, color: 'text-blue-600' };
    }

    return { label: 'Publicado', color: 'text-green-600' };
  };

  if (inline && !isExpanded) {
    const status = getScheduleStatus();
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {getContentTypeLabel(content.type)}: {content.title}
            </p>
            <p className={`text-sm ${status.color}`}>{status.label}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="px-3 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
        >
          Configurar Agendamento
        </button>
      </div>
    );
  }

  return (
    <div className={inline ? 'p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700' : ''}>
      {inline && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Agendamento de Conteúdo
          </h3>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* Publish Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Data de Publicação *
            </label>
            <input
              type="date"
              value={settings.publishDate}
              onChange={(e) => setSettings({ ...settings, publishDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 ${
                errors.publishDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.publishDate && <p className="text-red-500 text-sm mt-1">{errors.publishDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Horário de Publicação
            </label>
            <input
              type="time"
              value={settings.publishTime}
              onChange={(e) => setSettings({ ...settings, publishTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700"
            />
          </div>
        </div>

        {/* Unpublish Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <input
              type="checkbox"
              checked={!!settings.unpublishDate}
              onChange={(e) => setSettings({
                ...settings,
                unpublishDate: e.target.checked ? new Date().toISOString().split('T')[0] : ''
              })}
              className="rounded border-gray-300 text-terracota focus:ring-terracota"
            />
            Despublicar automaticamente
          </label>

          {settings.unpublishDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data de Despublicação
                </label>
                <input
                  type="date"
                  value={settings.unpublishDate}
                  onChange={(e) => setSettings({ ...settings, unpublishDate: e.target.value })}
                  min={settings.publishDate}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 ${
                    errors.unpublishDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.unpublishDate && <p className="text-red-500 text-sm mt-1">{errors.unpublishDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Horário de Despublicação
                </label>
                <input
                  type="time"
                  value={settings.unpublishTime}
                  onChange={(e) => setSettings({ ...settings, unpublishTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          )}
        </div>

        {/* Recurring Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <input
              type="checkbox"
              checked={settings.isRecurring}
              onChange={(e) => setSettings({ ...settings, isRecurring: e.target.checked })}
              className="rounded border-gray-300 text-terracota focus:ring-terracota"
            />
            Conteúdo recorrente
          </label>

          {settings.isRecurring && (
            <div className="space-y-4 ml-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Padrão de Recorrência
                </label>
                <select
                  value={settings.recurringPattern}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    recurringPattern: e.target.value as 'daily' | 'weekly' | 'monthly' 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700"
                >
                  <option value="daily">Diariamente</option>
                  <option value="weekly">Semanalmente</option>
                  <option value="monthly">Mensalmente</option>
                </select>
              </div>

              {settings.recurringPattern === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dias da Semana
                  </label>
                  <div className="flex gap-2">
                    {weekDays.map(day => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => {
                          const days = settings.recurringDays || [];
                          if (days.includes(day.value)) {
                            setSettings({
                              ...settings,
                              recurringDays: days.filter(d => d !== day.value)
                            });
                          } else {
                            setSettings({
                              ...settings,
                              recurringDays: [...days, day.value]
                            });
                          }
                        }}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          settings.recurringDays?.includes(day.value)
                            ? 'bg-terracota text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                  {errors.recurringDays && <p className="text-red-500 text-sm mt-1">{errors.recurringDays}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data de Término da Recorrência *
                </label>
                <input
                  type="date"
                  value={settings.recurringEndDate}
                  onChange={(e) => setSettings({ ...settings, recurringEndDate: e.target.value })}
                  min={settings.publishDate}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 ${
                    errors.recurringEndDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.recurringEndDate && <p className="text-red-500 text-sm mt-1">{errors.recurringEndDate}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <input
              type="checkbox"
              checked={settings.notifyStudents}
              onChange={(e) => setSettings({ ...settings, notifyStudents: e.target.checked })}
              className="rounded border-gray-300 text-terracota focus:ring-terracota"
            />
            Notificar alunas
          </label>

          {settings.notifyStudents && (
            <div className="ml-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notificar quantas horas antes?
              </label>
              <select
                value={settings.notifyHoursBefore}
                onChange={(e) => setSettings({ ...settings, notifyHoursBefore: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700"
              >
                <option value={1}>1 hora antes</option>
                <option value={2}>2 horas antes</option>
                <option value={6}>6 horas antes</option>
                <option value={12}>12 horas antes</option>
                <option value={24}>24 horas antes</option>
                <option value={48}>48 horas antes</option>
              </select>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Sobre o agendamento:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                <li>O conteúdo será publicado automaticamente na data e hora especificadas</li>
                <li>As alunas só terão acesso ao conteúdo após a publicação</li>
                {settings.isRecurring && (
                  <li>Novas instâncias do conteúdo serão criadas conforme o padrão definido</li>
                )}
                {settings.notifyStudents && (
                  <li>Notificações serão enviadas por email e no app</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Salvar Agendamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentScheduler;