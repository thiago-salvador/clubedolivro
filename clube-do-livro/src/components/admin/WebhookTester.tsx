/**
 * WebhookTester - Component for testing Hotmart webhook functionality
 * Allows admins to simulate webhook events and monitor results
 */

import React, { useState } from 'react';
import { 
  Zap, Play, Clock, CheckCircle, XCircle, User, 
  ShoppingCart, Mail, Eye, Settings, RotateCcw
} from 'lucide-react';
import { webhookService } from '../../services/webhook.service';
import { HotmartEventType, WebhookResponse, MockWebhookData } from '../../types/webhook.types';

interface WebhookTesterProps {
  className?: string;
}

const EVENT_TYPES: { value: HotmartEventType; label: string; icon: any; color: string }[] = [
  { value: 'PURCHASE_COMPLETED', label: 'Compra Finalizada', icon: CheckCircle, color: 'text-green-600' },
  { value: 'PURCHASE_CANCELED', label: 'Compra Cancelada', icon: XCircle, color: 'text-red-600' },
  { value: 'PURCHASE_REFUNDED', label: 'Compra Reembolsada', icon: RotateCcw, color: 'text-orange-600' },
  { value: 'SUBSCRIPTION_CANCELED', label: 'Assinatura Cancelada', icon: XCircle, color: 'text-red-600' }
];

const MOCK_PRODUCTS = [
  { id: 123456, name: 'Clube do Livro no Divã - Acesso Completo', price: 197.00 },
  { id: 123457, name: 'Clube do Livro no Divã - Módulo Básico', price: 97.00 },
  { id: 123458, name: 'Workshop Mulheres que Correm com os Lobos', price: 47.00 }
];

export const WebhookTester: React.FC<WebhookTesterProps> = ({ className = '' }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<HotmartEventType>('PURCHASE_COMPLETED');
  const [mockData, setMockData] = useState<MockWebhookData>({
    buyerName: 'Maria Silva',
    buyerEmail: 'maria.silva@example.com',
    buyerPhone: '(11) 99999-9999',
    productId: 123456,
    productName: 'Clube do Livro no Divã - Acesso Completo',
    transactionValue: 197.00,
    event: 'PURCHASE_COMPLETED'
  });
  const [lastResult, setLastResult] = useState<WebhookResponse | null>(null);
  const [resultHistory, setResultHistory] = useState<(WebhookResponse & { timestamp: Date; event: HotmartEventType })[]>([]);

  const handleSimulate = async () => {
    setIsSimulating(true);
    
    try {
      const result = await webhookService.simulateWebhook({
        event: selectedEvent,
        data: {
          buyer: {
            name: mockData.buyerName || 'Maria Silva',
            email: mockData.buyerEmail || 'maria.silva@example.com',
            phone: mockData.buyerPhone || '(11) 99999-9999'
          },
          product: {
            id: mockData.productId || 123456,
            name: mockData.productName || 'Clube do Livro no Divã - Acesso Completo'
          },
          transaction: {
            transaction_id: 'TEST_' + Date.now(),
            value: mockData.transactionValue || 197.00,
            purchase_date: new Date().toISOString()
          }
        }
      });

      setLastResult(result);
      setResultHistory(prev => [{
        ...result,
        timestamp: new Date(),
        event: selectedEvent
      }, ...prev.slice(0, 9)]); // Keep last 10 results

      console.log('🧪 Webhook simulation result:', result);
      
    } catch (error) {
      console.error('❌ Webhook simulation error:', error);
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        code: 'SIMULATION_ERROR'
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleProductChange = (productId: number) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (product) {
      setMockData(prev => ({
        ...prev,
        productId: product.id,
        productName: product.name,
        transactionValue: product.price
      }));
    }
  };

  const selectedEventData = EVENT_TYPES.find(e => e.value === selectedEvent);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Testador de Webhook Hotmart
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Simule eventos do webhook para testar a integração
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Event Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Tipo de Evento
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EVENT_TYPES.map((eventType) => {
              const Icon = eventType.icon;
              return (
                <button
                  key={eventType.value}
                  onClick={() => setSelectedEvent(eventType.value)}
                  className={`p-3 border rounded-lg text-left transition-colors flex items-center gap-3 ${
                    selectedEvent === eventType.value
                      ? 'border-terracota bg-terracota/5 dark:bg-terracota/10'
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${eventType.color}`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {eventType.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mock Data Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Comprador
            </label>
            <input
              type="text"
              value={mockData.buyerName || ''}
              onChange={(e) => setMockData(prev => ({ ...prev, buyerName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              placeholder="Maria Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email do Comprador
            </label>
            <input
              type="email"
              value={mockData.buyerEmail || ''}
              onChange={(e) => setMockData(prev => ({ ...prev, buyerEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              placeholder="maria.silva@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Produto
            </label>
            <select
              value={mockData.productId || 123456}
              onChange={(e) => handleProductChange(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {MOCK_PRODUCTS.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - R$ {product.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefone (opcional)
            </label>
            <input
              type="text"
              value={mockData.buyerPhone || ''}
              onChange={(e) => setMockData(prev => ({ ...prev, buyerPhone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        {/* Simulate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-6 py-3 bg-terracota hover:bg-terracota/90 disabled:bg-terracota/50 text-white rounded-lg font-medium transition-colors"
          >
            {isSimulating ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isSimulating ? 'Simulando...' : 'Simular Webhook'}
          </button>
        </div>

        {/* Last Result */}
        {lastResult && (
          <div className={`p-4 rounded-lg border ${
            lastResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {lastResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <h4 className={`font-medium ${
                lastResult.success 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {lastResult.success ? 'Simulação Bem-sucedida' : 'Simulação Falhou'}
              </h4>
            </div>
            
            {lastResult.message && (
              <p className={`text-sm mb-2 ${
                lastResult.success 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {lastResult.message}
              </p>
            )}

            {lastResult.error && (
              <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                <strong>Erro:</strong> {lastResult.error}
              </p>
            )}

            {lastResult.data && (
              <div className="text-sm space-y-1">
                <p className="text-green-700 dark:text-green-300">
                  <strong>Dados processados:</strong>
                </p>
                <ul className="text-green-600 dark:text-green-400 space-y-1 ml-4">
                  {lastResult.data.userEmail && (
                    <li>• Email: {lastResult.data.userEmail}</li>
                  )}
                  {lastResult.data.productId && (
                    <li>• Produto ID: {lastResult.data.productId}</li>
                  )}
                  {lastResult.data.userId && (
                    <li>• Usuário ID: {lastResult.data.userId}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Results History */}
        {resultHistory.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Histórico de Simulações
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {resultHistory.map((result, index) => {
                const eventData = EVENT_TYPES.find(e => e.value === result.event);
                const Icon = eventData?.icon || Zap;
                
                return (
                  <div
                    key={index}
                    className={`p-3 rounded border text-sm ${
                      result.success
                        ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${eventData?.color || 'text-gray-500'}`} />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {eventData?.label || result.event}
                        </span>
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {result.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    {result.message && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {result.message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};