import React, { useState } from 'react';
import ModerationSettings from './ModerationSettings';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  Hash,
  Lock,
  Unlock,
  Users,
  MessageSquare,
  GripVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DebateChannel } from '../../types/admin.types';
import { UserRole } from '../../types';

interface ChannelManagerProps {
  channels: DebateChannel[];
  onUpdate: (channels: DebateChannel[]) => void;
  courseId: string;
  currentUser: any; // Should be User type
}

interface ChannelFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  minimumRole: UserRole;
  isModerated: boolean;
  rules: string;
  bannedWords: string;
  allowFiles: boolean;
  allowImages: boolean;
}

const defaultIcons = [
  { value: 'MessageSquare', icon: MessageSquare, label: 'Discussão' },
  { value: 'Users', icon: Users, label: 'Comunidade' },
  { value: 'Hash', icon: Hash, label: 'Tópico' },
  { value: 'Lock', icon: Lock, label: 'Privado' },
  { value: 'Unlock', icon: Unlock, label: 'Público' }
];

const defaultColors = [
  '#B8654B', // terracota
  '#4D381B', // marrom-escuro
  '#7C9885', // verde-oliva
  '#6B8E23', // verde-floresta
  '#DAA520', // dourado
  '#8B4513', // saddle brown
  '#CD853F', // peru
  '#D2691E'  // chocolate
];

const ChannelManager: React.FC<ChannelManagerProps> = ({
  channels,
  onUpdate,
  courseId,
  currentUser
}) => {
  const [editingChannel, setEditingChannel] = useState<string | null>(null);
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);
  const [showNewChannelForm, setShowNewChannelForm] = useState(false);
  const [draggedChannel, setDraggedChannel] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ChannelFormData>({
    name: '',
    description: '',
    icon: 'MessageSquare',
    color: '#B8654B',
    minimumRole: UserRole.ALUNA,
    isModerated: false,
    rules: '',
    bannedWords: '',
    allowFiles: false,
    allowImages: true
  });
  const [activeTab, setActiveTab] = useState<'basic' | 'moderation'>('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do canal é obrigatório';
    }

    if (formData.isModerated && !formData.rules.trim()) {
      newErrors.rules = 'Canais moderados devem ter regras definidas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateChannel = () => {
    if (!validateForm()) return;

    const newChannel: DebateChannel = {
      id: `channel-${Date.now()}`,
      courseId,
      name: formData.name.trim(),
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description.trim(),
      icon: formData.icon,
      color: formData.color,
      orderIndex: channels.length,
      requiredTags: [], // Empty for now - can be enhanced later
      minimumRole: formData.minimumRole,
      isActive: true,
      requireModeration: formData.isModerated,
      rules: formData.rules.trim() || undefined,
      bannedWords: formData.bannedWords.trim() ? formData.bannedWords.split('\n').map(w => w.trim()).filter(Boolean) : [],
      allowFiles: formData.allowFiles,
      allowImages: formData.allowImages,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser,
      lastModifiedBy: currentUser
    };

    onUpdate([...channels, newChannel]);
    setShowNewChannelForm(false);
    resetForm();
  };

  const handleUpdateChannel = (channelId: string) => {
    if (!validateForm()) return;

    const updatedChannels = channels.map(channel => {
      if (channel.id === channelId) {
        return {
          ...channel,
          name: formData.name.trim(),
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description.trim(),
          icon: formData.icon,
          color: formData.color,
          requiredTags: channel.requiredTags || [], // Keep existing tags
          minimumRole: formData.minimumRole,
          requireModeration: formData.isModerated,
          rules: formData.rules.trim() || undefined,
          bannedWords: formData.bannedWords.trim() ? formData.bannedWords.split('\n').map(w => w.trim()).filter(Boolean) : [],
          allowFiles: formData.allowFiles,
          allowImages: formData.allowImages,
          lastModifiedBy: currentUser,
          updatedAt: new Date()
        };
      }
      return channel;
    });

    onUpdate(updatedChannels);
    setEditingChannel(null);
    resetForm();
  };

  const handleDeleteChannel = (channelId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este canal? Esta ação não pode ser desfeita.')) {
      onUpdate(channels.filter(channel => channel.id !== channelId));
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedChannel(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedChannel === null || draggedChannel === dropIndex) {
      setDraggedChannel(null);
      setDragOverIndex(null);
      return;
    }

    const reorderedChannels = [...channels];
    const [draggedItem] = reorderedChannels.splice(draggedChannel, 1);
    reorderedChannels.splice(dropIndex, 0, draggedItem);

    const updatedChannels = reorderedChannels.map((channel, index) => ({
      ...channel,
      orderIndex: index
    }));

    onUpdate(updatedChannels);
    setDraggedChannel(null);
    setDragOverIndex(null);
  };

  const startEditingChannel = (channel: DebateChannel) => {
    setFormData({
      name: channel.name,
      description: channel.description || '',
      icon: channel.icon,
      color: channel.color,
      minimumRole: channel.minimumRole || UserRole.ALUNA,
      isModerated: channel.requireModeration || false,
      rules: channel.rules || '',
      bannedWords: channel.bannedWords ? channel.bannedWords.join('\n') : '',
      allowFiles: channel.allowFiles || false,
      allowImages: channel.allowImages !== false
    });
    setEditingChannel(channel.id);
    setExpandedChannel(channel.id);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'MessageSquare',
      color: '#B8654B',
      minimumRole: UserRole.ALUNA,
      isModerated: false,
      rules: '',
      bannedWords: '',
      allowFiles: false,
      allowImages: true
    });
    setErrors({});
  };



  const getIconComponent = (iconName: string) => {
    const iconConfig = defaultIcons.find(i => i.value === iconName);
    return iconConfig ? iconConfig.icon : MessageSquare;
  };

  const renderChannelForm = (isNew: boolean = true, currentChannel?: DebateChannel) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'basic'
                ? 'border-terracota text-terracota'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Informações Básicas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('moderation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'moderation'
                ? 'border-terracota text-terracota'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Moderação
          </button>
        </nav>
      </div>

      {activeTab === 'basic' ? (
        <>
          {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome do Canal *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-800 ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ex: Discussões Gerais"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nível Mínimo de Acesso
          </label>
          <select
            value={formData.minimumRole}
            onChange={(e) => setFormData({ ...formData, minimumRole: e.target.value as UserRole })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-800"
          >
            <option value={UserRole.ALUNA}>Aluna</option>
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-800 resize-none"
          placeholder="Descreva o propósito deste canal..."
        />
      </div>

      {/* Icon and Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ícone
          </label>
          <div className="flex gap-2">
            {defaultIcons.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData({ ...formData, icon: value })}
                className={`p-2 rounded-lg transition-colors ${
                  formData.icon === value
                    ? 'bg-terracota text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={label}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cor
          </label>
          <div className="flex gap-2">
            {defaultColors.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-8 h-8 rounded-lg transition-all ${
                  formData.color === color
                    ? 'ring-2 ring-offset-2 ring-terracota'
                    : ''
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
        </>
      ) : (
        /* Moderation Tab */
        <ModerationSettings
          channel={currentChannel ? {
            ...currentChannel,
            requireModeration: formData.isModerated,
            rules: formData.rules,
            bannedWords: formData.bannedWords.trim() ? formData.bannedWords.split('\n').map(w => w.trim()).filter(Boolean) : []
          } : undefined}
          onChannelUpdate={(bannedWords) => {
            setFormData({ ...formData, bannedWords: bannedWords.join('\n') });
          }}
        />
      )}


      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => {
            if (isNew) {
              setShowNewChannelForm(false);
            } else {
              setEditingChannel(null);
            }
            resetForm();
          }}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => {
            if (isNew) {
              handleCreateChannel();
            } else {
              handleUpdateChannel(editingChannel!);
            }
          }}
          className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isNew ? 'Criar Canal' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Canais de Debate
        </h3>
        {!showNewChannelForm && (
          <button
            type="button"
            onClick={() => setShowNewChannelForm(true)}
            className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Canal
          </button>
        )}
      </div>

      {/* New Channel Form */}
      {showNewChannelForm && renderChannelForm(true)}

      {/* Channels List */}
      <div className="space-y-2">
        {channels.length === 0 && !showNewChannelForm && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum canal criado ainda</p>
          </div>
        )}

        {channels.sort((a, b) => a.orderIndex - b.orderIndex).map((channel, index) => {
          const IconComponent = getIconComponent(channel.icon);
          const isEditing = editingChannel === channel.id;
          const isExpanded = expandedChannel === channel.id || isEditing;

          return (
            <div
              key={channel.id}
              draggable={!isEditing}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className={`bg-white dark:bg-gray-800 rounded-lg border overflow-hidden transition-all ${
                dragOverIndex === index
                  ? 'border-terracota shadow-lg transform scale-[1.02]'
                  : 'border-gray-200 dark:border-gray-700'
              } ${
                draggedChannel === index ? 'opacity-50' : ''
              }`}
            >
              {/* Channel Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="cursor-move opacity-50 hover:opacity-100 transition-opacity"
                      title="Arrastar para reordenar"
                    >
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: channel.color }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        {channel.name}
                        {channel.requireModeration && (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded">
                            Moderado
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Nível mínimo: {channel.minimumRole}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={() => setExpandedChannel(isExpanded ? null : channel.id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditingChannel(channel)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteChannel(channel.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {isEditing ? (
                    renderChannelForm(false, channel)
                  ) : (
                    <div className="p-4 space-y-4">
                      {channel.description && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {channel.description}
                        </p>
                      )}

                      {channel.rules && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Regras do Canal:
                          </h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                            {channel.rules}
                          </div>
                        </div>
                      )}

                      {channel.bannedWords && channel.bannedWords.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Palavras Proibidas:
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {channel.bannedWords.map((word, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded"
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Permite arquivos:</span>
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            {channel.allowFiles ? 'Sim' : 'Não'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Permite imagens:</span>
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            {channel.allowImages ? 'Sim' : 'Não'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChannelManager;