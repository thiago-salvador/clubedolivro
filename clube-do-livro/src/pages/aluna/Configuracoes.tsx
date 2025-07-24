import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../../components/ui/Tooltip';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    bio: string;
    location: string;
  };
  notifications: {
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
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'pt-BR' | 'en-US';
    fontSize: 'small' | 'medium' | 'large';
  };
  privacy: {
    profileVisibility: 'public' | 'members' | 'private';
    showActivity: boolean;
    showBadges: boolean;
    allowDirectMessages: boolean;
    showLastSeen: boolean;
    dataProcessing: boolean;
    marketingCommunications: boolean;
  };
  subscription: {
    plan: string;
    status: 'active' | 'cancelled' | 'expired';
    nextBilling: Date;
    paymentMethod: string;
  };
}

const Configuracoes: React.FC = () => {
  const { user, updateAvatar } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'preferences' | 'privacy' | 'subscription'>('profile');
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  // Estados para upload de foto
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [showImageCropModal, setShowImageCropModal] = useState(false);
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);

  // Verificar permissão de notificação ao carregar
  useEffect(() => {
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
    }
  }, []);
  
  // Estados para gerenciar assinatura
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Estados para notificações push
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      birthDate: '',
      bio: '',
      location: ''
    },
    notifications: {
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
    },
    preferences: {
      theme: 'light',
      language: 'pt-BR',
      fontSize: 'medium'
    },
    privacy: {
      profileVisibility: 'members',
      showActivity: true,
      showBadges: true,
      allowDirectMessages: true,
      showLastSeen: false,
      dataProcessing: true,
      marketingCommunications: false
    },
    subscription: {
      plan: 'Clube do Livro - Anual',
      status: 'active',
      nextBilling: new Date('2025-03-20'),
      paymentMethod: '**** **** **** 1234'
    }
  });

  useEffect(() => {
    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Carregar imagem de perfil salva
    const savedProfileImage = localStorage.getItem('user_profile_image');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('user_settings', JSON.stringify(settings));
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validações
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        alert('Formato de arquivo não suportado. Use JPG, PNG ou WEBP.');
        return;
      }
      
      if (file.size > maxSize) {
        alert('Arquivo muito grande. O tamanho máximo é 5MB.');
        return;
      }
      
      setTempImageFile(file);
      setShowImageCropModal(true);
    }
  };

  const handleImageCrop = () => {
    if (tempImageFile) {
      setIsImageUploading(true);
      
      // Simular processamento de imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfileImage(imageUrl);
        localStorage.setItem('user_profile_image', imageUrl);
        updateAvatar(imageUrl); // Atualizar no contexto
        setIsImageUploading(false);
        setShowImageCropModal(false);
        setTempImageFile(null);
        
        // Feedback visual
        setShowSaveMessage(true);
        setTimeout(() => setShowSaveMessage(false), 3000);
      };
      reader.readAsDataURL(tempImageFile);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    localStorage.removeItem('user_profile_image');
    updateAvatar(null); // Atualizar no contexto
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const handleExportData = () => {
    // Coletar todos os dados do usuário
    const userData = {
      profile: {
        name: user?.name || settings.profile.name,
        email: user?.email || settings.profile.email,
        phone: settings.profile.phone,
        birthDate: settings.profile.birthDate,
        bio: settings.profile.bio,
        avatar: user?.avatar || profileImage,
        joinedDate: user?.joinedDate,
        badges: user?.badges || []
      },
      settings: {
        notifications: settings.notifications,
        preferences: settings.preferences,
        privacy: settings.privacy
      },
      activityData: {
        // Dados de atividade do localStorage
        communitySort: localStorage.getItem('community_sort_option'),
        linkFavorites: JSON.parse(localStorage.getItem('link_favorites') || '[]'),
        linkClickCounts: JSON.parse(localStorage.getItem('link_click_counts') || '{}'),
        visitedSections: {
          comeceSection: localStorage.getItem('visited_comece_section')
        }
      },
      suggestions: {
        linkSuggestions: JSON.parse(localStorage.getItem('link_suggestions') || '[]')
      },
      exportInfo: {
        exportDate: new Date().toISOString(),
        dataVersion: '1.0',
        exportedBy: 'Clube do Livro - Sistema de Configurações'
      }
    };

    // Criar arquivo JSON para download
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Criar link de download
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clube-do-livro-dados-${new Date().toISOString().split('T')[0]}.json`;
    
    // Fazer download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpar URL
    URL.revokeObjectURL(url);
    
    // Feedback específico para export
    alert('✅ Seus dados foram exportados com sucesso! O arquivo foi baixado para sua pasta de Downloads.');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new !== passwordData.confirm) {
      alert('As senhas não coincidem!');
      return;
    }
    
    if (passwordData.new.length < 8) {
      alert('A nova senha deve ter pelo menos 8 caracteres!');
      return;
    }
    
    // Simular alteração de senha
    console.log('Senha alterada com sucesso!');
    setShowPasswordModal(false);
    setPasswordData({ current: '', new: '', confirm: '' });
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = () => {
    setSettings(prev => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        status: 'cancelled'
      }
    }));
    setShowCancelModal(false);
    handleSave();
    alert('✅ Assinatura cancelada com sucesso. Você manterá o acesso até ' + settings.subscription.nextBilling.toLocaleDateString('pt-BR'));
  };

  const handleUpdatePayment = () => {
    setShowPaymentModal(true);
  };

  const handleViewPaymentHistory = () => {
    setShowPaymentHistoryModal(true);
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  const handleReactivateSubscription = () => {
    setSettings(prev => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        status: 'active'
      }
    }));
    handleSave();
    alert('✅ Assinatura reativada com sucesso!');
  };

  // Funções para notificações push
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Seu navegador não suporta notificações push.');
      return;
    }

    setIsRequestingPermission(true);
    
    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      
      if (permission === 'granted') {
        // Ativar notificações push nas configurações
        setSettings(prev => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            push: {
              ...prev.notifications.push,
              enabled: true
            }
          }
        }));
        
        // Mostrar notificação de teste
        new Notification('🔔 Notificações Ativadas!', {
          body: 'Você receberá lembretes importantes do Clube do Livro.',
          icon: '/favicon.ico'
        });
        
        handleSave();
      } else if (permission === 'denied') {
        alert('Permissão negada. Você pode ativar manualmente nas configurações do navegador.');
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      alert('Erro ao solicitar permissão. Tente novamente.');
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const getPermissionStatusText = () => {
    switch (pushPermission) {
      case 'granted':
        return { text: 'Permitidas', color: 'text-green-600', icon: '✅' };
      case 'denied':
        return { text: 'Negadas', color: 'text-red-600', icon: '❌' };
      default:
        return { text: 'Não solicitadas', color: 'text-gray-600', icon: '⏸️' };
    }
  };

  // Função para enviar notificação de teste
  const sendTestNotification = () => {
    if (pushPermission !== 'granted') {
      alert('Você precisa permitir notificações primeiro.');
      return;
    }

    const notifications = [
      {
        title: '📚 Novo capítulo disponível!',
        body: 'O Capítulo 6 já está disponível para leitura.',
        icon: '/favicon.ico'
      },
      {
        title: '🔔 Encontro em 1 hora!',
        body: 'Não esqueça: seu encontro começa às 19:30.',
        icon: '/favicon.ico'
      },
      {
        title: '💬 Nova resposta',
        body: 'Maria respondeu ao seu comentário na comunidade.',
        icon: '/favicon.ico'
      },
      {
        title: '✨ Conquista desbloqueada!',
        body: 'Você completou sua primeira semana de leitura.',
        icon: '/favicon.ico'
      }
    ];

    // Selecionar notificação aleatória
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    
    new Notification(randomNotification.title, {
      body: randomNotification.body,
      icon: randomNotification.icon,
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      tag: 'test-notification',
      requireInteraction: false
    });
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'notifications', label: 'Notificações', icon: '🔔' },
    { id: 'preferences', label: 'Preferências', icon: '⚙️' },
    { id: 'privacy', label: 'Privacidade', icon: '🔒' },
    { id: 'subscription', label: 'Assinatura', icon: '💳' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span>⚙️</span>
          Configurações
        </h1>
        <p className="text-gray-700">
          Gerencie suas informações pessoais, preferências e assinatura.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-terracota border-b-2 border-terracota'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
              
              {/* Profile Image Section */}
              <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
                <div className="relative group">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Foto de perfil"
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-terracota flex items-center justify-center text-white text-2xl font-semibold ring-4 ring-white shadow-lg">
                      {settings.profile.name.charAt(0).toUpperCase() || 'A'}
                    </div>
                  )}
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  
                  {/* Click handler */}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isImageUploading}
                  />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-2">Foto de Perfil</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Clique na foto para alterar. Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 5MB.
                  </p>
                  <div className="flex gap-3">
                    <label className="px-4 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors cursor-pointer">
                      {isImageUploading ? 'Enviando...' : 'Alterar Foto'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isImageUploading}
                      />
                    </label>
                    {profileImage && (
                      <button
                        onClick={removeProfileImage}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, name: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, email: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, phone: e.target.value }
                    })}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de nascimento
                  </label>
                  <input
                    type="date"
                    value={settings.profile.birthDate}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, birthDate: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  value={settings.profile.location}
                  onChange={(e) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, location: e.target.value }
                  })}
                  placeholder="Cidade, Estado"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sobre mim
                </label>
                <textarea
                  value={settings.profile.bio}
                  onChange={(e) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, bio: e.target.value }
                  })}
                  rows={4}
                  placeholder="Conte um pouco sobre você e sua jornada..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent resize-none"
                />
              </div>

              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Segurança</h4>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  🔐 Alterar Senha
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Notificação</h3>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Notificações por E-mail</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">Novo conteúdo disponível</span>
                      <Tooltip content="Receba um e-mail quando novos capítulos, vídeos ou exercícios forem liberados.">
                        <span className="text-gray-400 hover:text-gray-600 cursor-help">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </Tooltip>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.email.newContent}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: { ...settings.notifications.email, newContent: e.target.checked }
                        }
                      })}
                      className="rounded text-terracota focus:ring-terracota"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">Lembretes de encontros</span>
                      <Tooltip content="Receba lembretes 24h e 1h antes dos encontros online do clube.">
                        <span className="text-gray-400 hover:text-gray-600 cursor-help">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </Tooltip>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.email.meetings}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: { ...settings.notifications.email, meetings: e.target.checked }
                        }
                      })}
                      className="rounded text-terracota focus:ring-terracota"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">Mensagens da comunidade</span>
                      <Tooltip content="Seja notificada quando alguém responder aos seus comentários ou mencioná-la.">
                        <span className="text-gray-400 hover:text-gray-600 cursor-help">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </Tooltip>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.email.messages}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: { ...settings.notifications.email, messages: e.target.checked }
                        }
                      })}
                      className="rounded text-terracota focus:ring-terracota"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">Novidades e ofertas</span>
                      <Tooltip content="Receba informações sobre novos benefícios, descontos e ofertas exclusivas para membros.">
                        <span className="text-gray-400 hover:text-gray-600 cursor-help">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </Tooltip>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.email.marketing}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: { ...settings.notifications.email, marketing: e.target.checked }
                        }
                      })}
                      className="rounded text-terracota focus:ring-terracota"
                    />
                  </label>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-3">Notificações Push</h4>
                
                {/* Status da permissão */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">Status da Permissão</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg">{getPermissionStatusText().icon}</span>
                        <span className={`text-sm font-medium ${getPermissionStatusText().color}`}>
                          {getPermissionStatusText().text}
                        </span>
                      </div>
                    </div>
                    
                    {pushPermission !== 'granted' && (
                      <button
                        onClick={requestNotificationPermission}
                        disabled={isRequestingPermission || pushPermission === 'denied'}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          pushPermission === 'denied'
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-terracota text-white hover:bg-marrom-escuro'
                        }`}
                      >
                        {isRequestingPermission ? 'Solicitando...' : 
                         pushPermission === 'denied' ? 'Negada' : 'Ativar Notificações'}
                      </button>
                    )}

                    {pushPermission === 'granted' && (
                      <button
                        onClick={sendTestNotification}
                        className="px-4 py-2 text-terracota border border-terracota rounded-lg hover:bg-terracota hover:text-white transition-colors font-medium"
                      >
                        🔔 Testar Notificação
                      </button>
                    )}
                  </div>
                  
                  {pushPermission === 'denied' && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        🔒 As notificações foram negadas. Para ativar, vá nas configurações do seu navegador:
                      </p>
                      <ul className="mt-2 text-xs text-yellow-700 list-disc list-inside">
                        <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Configurações do site → Notificações</li>
                        <li><strong>Firefox:</strong> Configurações → Privacidade e segurança → Permissões → Notificações</li>
                        <li><strong>Safari:</strong> Preferências → Sites → Notificações</li>
                      </ul>
                    </div>
                  )}
                  
                  {pushPermission === 'default' && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        ℹ️ Clique em "Ativar Notificações" para receber lembretes importantes sobre encontros e novidades do clube.
                      </p>
                    </div>
                  )}
                  
                  {pushPermission === 'granted' && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✅ Notificações ativas! Use o botão "Testar Notificação" para ver um exemplo.
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Você receberá: lembretes de encontros, novos conteúdos, respostas aos seus comentários e conquistas.
                      </p>
                    </div>
                  )}
                </div>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">Ativar notificações do navegador</span>
                        <Tooltip content="Ative para receber notificações em tempo real diretamente no seu navegador, mesmo quando o site estiver fechado.">
                          <span className="text-gray-400 hover:text-gray-600 cursor-help">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Receba alertas em tempo real</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.push.enabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          push: { ...settings.notifications.push, enabled: e.target.checked }
                        }
                      })}
                      className="rounded text-terracota focus:ring-terracota"
                    />
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências do Sistema</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema
                </label>
                <select
                  value={theme}
                  onChange={(e) => {
                    const newTheme = e.target.value as 'light' | 'dark' | 'auto';
                    setTheme(newTheme);
                    setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, theme: newTheme }
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                >
                  <option value="light">☀️ Claro</option>
                  <option value="dark">🌙 Escuro</option>
                  <option value="auto">🌓 Automático</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma
                </label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, language: e.target.value as any }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                >
                  <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                  <option value="en-US">🇺🇸 English (US)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamanho da fonte
                </label>
                <div className="flex gap-4">
                  {['small', 'medium', 'large'].map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="fontSize"
                        value={size}
                        checked={settings.preferences.fontSize === size}
                        onChange={(e) => setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, fontSize: e.target.value as any }
                        })}
                        className="text-terracota focus:ring-terracota"
                      />
                      <span className={`text-gray-700 ${
                        size === 'small' ? 'text-sm' : 
                        size === 'large' ? 'text-lg' : 'text-base'
                      }`}>
                        {size === 'small' ? 'Pequena' : 
                         size === 'large' ? 'Grande' : 'Média'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Privacidade</h3>
              
              {/* Visibilidade do Perfil */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Visibilidade do Perfil</h4>
                <div className="space-y-3">
                  {[
                    { value: 'public', label: 'Público', desc: 'Qualquer pessoa pode ver seu perfil' },
                    { value: 'members', label: 'Apenas Membros', desc: 'Somente membros do clube podem ver' },
                    { value: 'private', label: 'Privado', desc: 'Apenas você pode ver seu perfil' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value={option.value}
                        checked={settings.privacy.profileVisibility === option.value}
                        onChange={(e) => setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, profileVisibility: e.target.value as any }
                        })}
                        className="mt-0.5 text-terracota focus:ring-terracota"
                      />
                      <div>
                        <span className="text-gray-900 font-medium">{option.label}</span>
                        <p className="text-sm text-gray-600">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Configurações de Atividade */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Exibir na Comunidade</h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <div>
                      <span className="text-gray-700 font-medium">Mostrar atividade recente</span>
                      <p className="text-sm text-gray-500 mt-1">Exibe suas postagens e comentários recentes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showActivity}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showActivity: e.target.checked }
                      })}
                      className="rounded text-terracota focus:ring-terracota"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <div>
                      <span className="text-gray-700 font-medium">Mostrar selos e conquistas</span>
                      <p className="text-sm text-gray-500 mt-1">Exibe seus badges no perfil público</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showBadges}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showBadges: e.target.checked }
                      })}
                      className="rounded text-terracota focus:ring-terracota"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <div>
                      <span className="text-gray-700 font-medium">Permitir mensagens diretas</span>
                      <p className="text-sm text-gray-500 mt-1">Outras alunas podem te enviar mensagens privadas</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowDirectMessages}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, allowDirectMessages: e.target.checked }
                      })}
                      className="rounded text-terracota focus:ring-terracota"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <div>
                      <span className="text-gray-700 font-medium">Mostrar último acesso</span>
                      <p className="text-sm text-gray-500 mt-1">Exibe quando você esteve online pela última vez</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showLastSeen}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showLastSeen: e.target.checked }
                      })}
                      className="rounded text-terracota focus:ring-terracota"
                    />
                  </label>
                </div>
              </div>

              {/* Privacidade de Dados */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Uso de Dados</h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <div>
                      <span className="text-gray-700 font-medium">Processamento de dados para melhorias</span>
                      <p className="text-sm text-gray-500 mt-1">Permitir análise de dados anônimos para melhorar a plataforma</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.dataProcessing}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, dataProcessing: e.target.checked }
                      })}
                      className="rounded text-terracota focus:ring-terracota"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <div>
                      <span className="text-gray-700 font-medium">Comunicações de marketing</span>
                      <p className="text-sm text-gray-500 mt-1">Receber informações sobre novos produtos e ofertas</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.marketingCommunications}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, marketingCommunications: e.target.checked }
                      })}
                      className="rounded text-terracota focus:ring-terracota"
                    />
                  </label>
                </div>
              </div>

              {/* Ações de Dados */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Seus Dados</h4>
                <div className="space-y-3">
                  <button 
                    onClick={handleExportData}
                    className="w-full bg-blue-100 text-blue-700 py-3 px-6 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                  >
                    📥 Exportar Meus Dados
                  </button>
                  <p className="text-sm text-gray-600">
                    Baixe uma cópia de todos os seus dados pessoais armazenados na plataforma.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Assinatura</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plano atual</span>
                  <span className="font-medium text-gray-900">{settings.subscription.plan}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                    settings.subscription.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : settings.subscription.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {settings.subscription.status === 'active' ? '✅ Ativa' : 
                     settings.subscription.status === 'cancelled' ? '❌ Cancelada' : 
                     '⏰ Expirada'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Próxima cobrança</span>
                  <span className="font-medium text-gray-900">
                    {settings.subscription.nextBilling.toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Forma de pagamento</span>
                  <span className="font-medium text-gray-900">{settings.subscription.paymentMethod}</span>
                </div>
              </div>

              {/* Planos Disponíveis */}
              <div className="bg-gradient-to-r from-terracota/10 to-marrom-escuro/10 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">💎 Upgrade de Plano</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2">Plano Anual</h5>
                    <p className="text-2xl font-bold text-terracota mb-2">R$ 297/ano</p>
                    <p className="text-sm text-gray-600 mb-3">Economia de 2 meses</p>
                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                      <li>✅ Acesso completo ao conteúdo</li>
                      <li>✅ Encontros ao vivo</li>
                      <li>✅ Comunidade exclusiva</li>
                      <li>✅ Material para download</li>
                    </ul>
                    {settings.subscription.plan !== 'Clube do Livro - Anual' && (
                      <button
                        onClick={handleUpgrade}
                        className="w-full bg-terracota text-white py-2 px-4 rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
                      >
                        Fazer Upgrade
                      </button>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border-2 border-terracota">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">Plano Vitalício</h5>
                      <span className="bg-terracota text-white px-2 py-1 rounded text-xs font-bold">POPULAR</span>
                    </div>
                    <p className="text-2xl font-bold text-terracota mb-2">R$ 997</p>
                    <p className="text-sm text-gray-600 mb-3">Pagamento único</p>
                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                      <li>✅ Acesso vitalício</li>
                      <li>✅ Todas as futuras atualizações</li>
                      <li>✅ Suporte prioritário</li>
                      <li>✅ Bônus exclusivos</li>
                    </ul>
                    <button
                      onClick={handleUpgrade}
                      className="w-full bg-terracota text-white py-2 px-4 rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
                    >
                      Garantir Vitalício
                    </button>
                  </div>
                </div>
              </div>

              {/* Ações da Assinatura */}
              <div className="space-y-3">
                <button 
                  onClick={handleUpdatePayment}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  💳 Atualizar Forma de Pagamento
                </button>
                
                <button 
                  onClick={handleViewPaymentHistory}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  📄 Histórico de Pagamentos
                </button>
                
                {settings.subscription.status === 'active' && (
                  <button
                    onClick={handleCancelSubscription}
                    className="w-full bg-red-50 text-red-600 py-3 px-6 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    ❌ Cancelar Assinatura
                  </button>
                )}
                
                {settings.subscription.status === 'cancelled' && (
                  <button
                    onClick={handleReactivateSubscription}
                    className="w-full bg-green-50 text-green-600 py-3 px-6 rounded-lg font-medium hover:bg-green-100 transition-colors"
                  >
                    ✅ Reativar Assinatura
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="px-6 pb-6 border-t">
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => navigate('/aluna')}
              className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
          
          {showSaveMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
              ✅ Configurações salvas com sucesso!
            </div>
          )}
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha atual
                </label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova senha
                </label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  required
                  minLength={8}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar nova senha
                </label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ current: '', new: '', confirm: '' });
                  }}
                  className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
                >
                  Alterar Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Crop Modal */}
      {showImageCropModal && tempImageFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Foto de Perfil</h3>
            
            <div className="text-center mb-6">
              <div className="inline-block relative">
                <img
                  src={URL.createObjectURL(tempImageFile)}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
                />
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Esta será sua nova foto de perfil.
              </p>
            </div>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowImageCropModal(false);
                  setTempImageFile(null);
                }}
                className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleImageCrop}
                disabled={isImageUploading}
                className="px-6 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors disabled:opacity-50"
              >
                {isImageUploading ? 'Processando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Cancelar Assinatura</h3>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja cancelar sua assinatura? Você manterá o acesso ao conteúdo até{' '}
              <strong>{settings.subscription.nextBilling.toLocaleDateString('pt-BR')}</strong>.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900"
              >
                Manter Assinatura
              </button>
              <button
                onClick={confirmCancelSubscription}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Sim, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Atualizar Pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Atualizar Forma de Pagamento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número do Cartão</label>
                <input
                  type="text"
                  placeholder="**** **** **** 1234"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Validade</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  alert('✅ Forma de pagamento atualizada com sucesso!');
                }}
                className="px-6 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Histórico de Pagamentos */}
      {showPaymentHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Histórico de Pagamentos</h3>
            <div className="space-y-3">
              {[
                { date: '2024-01-20', value: 'R$ 29,90', status: 'Pago', method: 'Cartão *1234' },
                { date: '2023-12-20', value: 'R$ 29,90', status: 'Pago', method: 'Cartão *1234' },
                { date: '2023-11-20', value: 'R$ 29,90', status: 'Pago', method: 'Cartão *1234' },
                { date: '2023-10-20', value: 'R$ 29,90', status: 'Pago', method: 'Cartão *1234' },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{payment.date}</p>
                    <p className="text-sm text-gray-600">{payment.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{payment.value}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPaymentHistoryModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Upgrade */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💎 Upgrade de Plano</h3>
            <p className="text-gray-700 mb-6">
              Você está prestes a fazer upgrade para um plano superior. 
              Isso será processado imediatamente e você terá acesso a todos os benefícios.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  alert('🎉 Upgrade realizado com sucesso! Bem-vinda ao seu novo plano!');
                }}
                className="px-6 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
              >
                Confirmar Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracoes;