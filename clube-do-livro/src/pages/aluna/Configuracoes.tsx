import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    bio: string;
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
  subscription: {
    plan: string;
    status: 'active' | 'cancelled' | 'expired';
    nextBilling: Date;
    paymentMethod: string;
  };
}

const Configuracoes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'preferences' | 'subscription'>('profile');
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      birthDate: '',
      bio: ''
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
  }, []);

  const handleSave = () => {
    localStorage.setItem('user_settings', JSON.stringify(settings));
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
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
    if (window.confirm('Tem certeza que deseja cancelar sua assinatura? Você perderá acesso ao conteúdo ao final do período atual.')) {
      setSettings(prev => ({
        ...prev,
        subscription: {
          ...prev.subscription,
          status: 'cancelled'
        }
      }));
      handleSave();
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'notifications', label: 'Notificações', icon: '🔔' },
    { id: 'preferences', label: 'Preferências', icon: '⚙️' },
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
                    <span className="text-gray-700">Novo conteúdo disponível</span>
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
                    <span className="text-gray-700">Lembretes de encontros</span>
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
                    <span className="text-gray-700">Mensagens da comunidade</span>
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
                    <span className="text-gray-700">Novidades e ofertas</span>
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
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <span className="text-gray-700 font-medium">Ativar notificações do navegador</span>
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
                  value={settings.preferences.theme}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, theme: e.target.value as any }
                  })}
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

              <div className="space-y-3">
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  💳 Atualizar Forma de Pagamento
                </button>
                
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors">
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
    </div>
  );
};

export default Configuracoes;