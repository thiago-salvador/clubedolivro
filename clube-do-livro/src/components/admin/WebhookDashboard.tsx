/**
 * WebhookDashboard - Component for monitoring webhook transactions and status
 * Shows transaction history, statistics, and integration health
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Activity, DollarSign, Users, Download, 
  CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Eye
} from 'lucide-react';
import { webhookService } from '../../services/webhook.service';
import { HotmartTransaction, HotmartEventType } from '../../types/webhook.types';

interface WebhookDashboardProps {
  className?: string;
}

interface WebhookStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalRevenue: number;
  uniqueUsers: number;
  eventCounts: Record<HotmartEventType, number>;
}

export const WebhookDashboard: React.FC<WebhookDashboardProps> = ({ className = '' }) => {
  const [transactions, setTransactions] = useState<HotmartTransaction[]>([]);
  const [stats, setStats] = useState<WebhookStats>({
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    totalRevenue: 0,
    uniqueUsers: 0,
    eventCounts: {
      'PURCHASE_COMPLETED': 0,
      'PURCHASE_CANCELED': 0,
      'PURCHASE_REFUNDED': 0,
      'SUBSCRIPTION_CANCELED': 0,
      'SUBSCRIPTION_REACTIVATED': 0,
      'PURCHASE_DELAYED': 0,
      'PURCHASE_APPROVED': 0
    }
  });
  const [selectedTransaction, setSelectedTransaction] = useState<HotmartTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    setIsLoading(true);
    
    try {
      const allTransactions = webhookService.getTransactions();
      setTransactions(allTransactions);
      
      // Calculate statistics
      const stats: WebhookStats = {
        totalTransactions: allTransactions.length,
        successfulTransactions: allTransactions.filter(t => t.status === 'completed').length,
        failedTransactions: allTransactions.filter(t => t.status === 'canceled' || t.status === 'refunded').length,
        totalRevenue: allTransactions
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0),
        uniqueUsers: new Set(allTransactions.map(t => t.buyerEmail)).size,
        eventCounts: {
          'PURCHASE_COMPLETED': 0,
          'PURCHASE_CANCELED': 0,
          'PURCHASE_REFUNDED': 0,
          'SUBSCRIPTION_CANCELED': 0,
          'SUBSCRIPTION_REACTIVATED': 0,
          'PURCHASE_DELAYED': 0,
          'PURCHASE_APPROVED': 0
        }
      };

      // Count events
      allTransactions.forEach(transaction => {
        stats.eventCounts[transaction.event] = (stats.eventCounts[transaction.event] || 0) + 1;
      });

      setStats(stats);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'canceled':
      case 'refunded':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventColor = (event: HotmartEventType) => {
    switch (event) {
      case 'PURCHASE_COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'PURCHASE_CANCELED':
      case 'SUBSCRIPTION_CANCELED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'PURCHASE_REFUNDED':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['ID', 'Event', 'Email', 'Name', 'Product', 'Amount', 'Status', 'Date'].join(','),
      ...transactions.map(t => [
        t.id,
        t.event,
        t.buyerEmail,
        t.buyerName,
        t.productName,
        t.amount.toFixed(2),
        t.status,
        t.createdAt.toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webhook-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracota"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Carregando transações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Transações
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalTransactions}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Receita Total
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Usuários Únicos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.uniqueUsers}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Taxa de Sucesso
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalTransactions > 0 
                  ? Math.round((stats.successfulTransactions / stats.totalTransactions) * 100)
                  : 0}%
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Histórico de Transações
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={loadTransactions}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
              <button
                onClick={exportTransactions}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-terracota hover:bg-terracota/90 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Comprador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-lg font-medium mb-2">Nenhuma transação encontrada</p>
                      <p className="text-sm">As transações do webhook aparecerão aqui</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEventColor(transaction.event)}`}>
                        {transaction.event}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.buyerName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.buyerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {transaction.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        R$ {transaction.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <span className="text-sm text-gray-900 dark:text-white capitalize">
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {transaction.createdAt.toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.createdAt.toLocaleTimeString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="text-terracota hover:text-terracota/80 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Detalhes da Transação
                </h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ID da Transação</label>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">{selectedTransaction.hotmartId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Evento</label>
                  <p className="text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEventColor(selectedTransaction.event)}`}>
                      {selectedTransaction.event}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nome do Comprador</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedTransaction.buyerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email do Comprador</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedTransaction.buyerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Produto</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedTransaction.productName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Valor</label>
                  <p className="text-sm text-gray-900 dark:text-white">R$ {selectedTransaction.amount.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedTransaction.status)}
                    <span className="text-sm text-gray-900 dark:text-white capitalize">
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Data de Criação</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTransaction.createdAt.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Data de Processamento</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTransaction.processedAt.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};