/**
 * HotmartIntegration - Admin page for managing Hotmart webhook integration
 * Combines webhook testing, monitoring, and configuration
 */

import React, { useState } from 'react';
import { WebhookTester } from '../../components/admin/WebhookTester';
import { WebhookDashboard } from '../../components/admin/WebhookDashboard';
import { 
  Zap, BarChart3, Settings, FileText, 
  CheckCircle, AlertTriangle, ExternalLink
} from 'lucide-react';

type TabType = 'dashboard' | 'tester' | 'config' | 'docs';

const HotmartIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'tester' as TabType, label: 'Testador', icon: Zap },
    { id: 'config' as TabType, label: 'Configuração', icon: Settings },
    { id: 'docs' as TabType, label: 'Documentação', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <WebhookDashboard />;
      
      case 'tester':
        return <WebhookTester />;
      
      case 'config':
        return <ConfigurationTab />;
      
      case 'docs':
        return <DocumentationTab />;
      
      default:
        return <WebhookDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Integração Hotmart
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie webhooks, monitore transações e configure a integração com o Hotmart
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Status da Integração
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                Funcionando (Mock)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Ambiente
              </h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Desenvolvimento
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Webhook URL
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Configurado
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-terracota text-terracota'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Configuration Tab Component
const ConfigurationTab: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('https://app.clubedolivro.com/api/webhooks/hotmart');
  const [secretKey, setSecretKey] = useState('****-****-****-****');
  const [isProduction, setIsProduction] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Configurações do Webhook
        </h3>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Modo de Desenvolvimento:</strong> Esta é uma simulação. Em produção, estas configurações 
              seriam gerenciadas pelo backend.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL do Webhook
          </label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            placeholder="https://app.clubedolivro.com/api/webhooks/hotmart"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            URL que receberá os webhooks do Hotmart
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chave Secreta
          </label>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            placeholder="Chave secreta do Hotmart"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Chave para validação das assinaturas
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="production-mode"
          checked={isProduction}
          onChange={(e) => setIsProduction(e.target.checked)}
          className="w-4 h-4 text-terracota bg-gray-100 border-gray-300 rounded focus:ring-terracota"
        />
        <label htmlFor="production-mode" className="text-sm text-gray-700 dark:text-gray-300">
          Modo de produção (validação de assinatura ativada)
        </label>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Eventos Monitorados
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            'PURCHASE_COMPLETED',
            'PURCHASE_CANCELED',
            'PURCHASE_REFUNDED',
            'SUBSCRIPTION_CANCELED'
          ].map((event) => (
            <div key={event} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {event}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-terracota hover:bg-terracota/90 text-white rounded-lg font-medium transition-colors">
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};

// Documentation Tab Component
const DocumentationTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Documentação da Integração
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Guia completo para configurar e usar a integração com Hotmart
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
            📋 Como funciona
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Hotmart envia webhooks quando uma compra é realizada</li>
            <li>• Sistema cria automaticamente conta da usuária</li>
            <li>• Tags são atribuídas baseadas no produto comprado</li>
            <li>• Email de boas-vindas é enviado automaticamente</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            🔧 Configuração no Hotmart
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>1. Acesse o painel do Hotmart:</strong>
            </p>
            <div className="bg-white dark:bg-gray-800 border rounded p-3">
              <code className="text-xs text-gray-600 dark:text-gray-400">
                https://app.hotmart.com/tools/webhooks
              </code>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>2. Configure o webhook com a URL:</strong>
            </p>
            <div className="bg-white dark:bg-gray-800 border rounded p-3">
              <code className="text-xs text-gray-600 dark:text-gray-400">
                https://app.clubedolivro.com/api/webhooks/hotmart
              </code>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>3. Eventos a serem configurados:</strong>
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
              <li>• PURCHASE_COMPLETED</li>
              <li>• PURCHASE_CANCELED</li>
              <li>• PURCHASE_REFUNDED</li>
              <li>• SUBSCRIPTION_CANCELED</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            🏷️ Associação Produtos-Tags
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Para que o sistema atribua automaticamente as tags corretas:
            </p>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>Acesse <strong>Gestão de Alunas → Tags de Produtos</strong></li>
              <li>Vá na aba "Associações Hotmart"</li>
              <li>Associe cada produto do Hotmart com as tags apropriadas</li>
              <li>Ative a sincronização automática</li>
            </ol>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            ⚠️ Troubleshooting
          </h4>
          <div className="space-y-3">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Webhook não está sendo recebido
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 mt-1 space-y-1 list-disc list-inside">
                <li>Verifique se a URL está correta no Hotmart</li>
                <li>Confirme se o servidor está respondendo na porta 443 (HTTPS)</li>
                <li>Teste usando o "Testador" acima</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Usuário não está sendo criado
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1 list-disc list-inside">
                <li>Verifique se o produto tem tags associadas</li>
                <li>Confirme se o email está no formato correto</li>
                <li>Veja os logs no "Dashboard" de transações</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-4">
            <a
              href="https://developers.hotmart.com/docs/pt-BR/v1/webhooks"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-terracota hover:text-terracota/80 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Documentação oficial do Hotmart
            </a>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button className="text-sm text-terracota hover:text-terracota/80 transition-colors">
              Reportar problema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotmartIntegration;