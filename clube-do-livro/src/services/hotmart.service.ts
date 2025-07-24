import { User, UserRole } from '../types/index';
import { HotmartProduct, hotmartIntegrationService } from './hotmart-integration.service';

export interface HotmartTransaction {
  id: string;
  transactionId: string;
  productId: string;
  buyerEmail: string;
  buyerName: string;
  status: 'APPROVED' | 'CANCELED' | 'REFUNDED' | 'CHARGEBACK' | 'BLOCKED';
  value: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  subscriptionId?: string;
  subscriptionStatus?: 'ACTIVE' | 'CANCELED' | 'OVERDUE' | 'DELAYED';
  validUntil?: Date;
  lastChecked: Date;
}

export interface AccessValidationResult {
  hasAccess: boolean;
  reason?: string;
  transactionId?: string;
  validUntil?: Date;
  subscriptionStatus?: string;
  lastChecked: Date;
}

export interface SyncJobResult {
  processedCount: number;
  updatedCount: number;
  blockedCount: number;
  errors: string[];
  startTime: Date;
  endTime: Date;
}

class HotmartService {
  private static instance: HotmartService;
  private transactions: Map<string, HotmartTransaction> = new Map();
  private syncInterval?: NodeJS.Timeout;
  private readonly SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.loadTransactions();
    this.initializeMockTransactions();
    this.startPeriodicSync();
  }

  static getInstance(): HotmartService {
    if (!HotmartService.instance) {
      HotmartService.instance = new HotmartService();
    }
    return HotmartService.instance;
  }

  private loadTransactions(): void {
    const stored = localStorage.getItem('hotmart_purchase_transactions');
    if (stored) {
      try {
        const parsedTransactions = JSON.parse(stored);
        this.transactions = new Map();
        
        parsedTransactions.forEach((transaction: any) => {
          this.transactions.set(transaction.buyerEmail, {
            ...transaction,
            createdAt: new Date(transaction.createdAt),
            updatedAt: new Date(transaction.updatedAt),
            validUntil: transaction.validUntil ? new Date(transaction.validUntil) : undefined,
            lastChecked: new Date(transaction.lastChecked)
          });
        });
      } catch (error) {
        console.error('Error loading Hotmart transactions:', error);
        this.transactions = new Map();
      }
    }
  }

  private saveTransactions(): void {
    const transactionArray = Array.from(this.transactions.values());
    localStorage.setItem('hotmart_purchase_transactions', JSON.stringify(transactionArray));
  }

  private initializeMockTransactions(): void {
    if (this.transactions.size === 0) {
      // Mock transactions for testing
      const mockTransactions: HotmartTransaction[] = [
        {
          id: 'tx-001',
          transactionId: 'HT123456789',
          productId: 'PROD123',
          buyerEmail: 'ana.silva@email.com',
          buyerName: 'Ana Silva',
          status: 'APPROVED',
          value: 297.00,
          currency: 'BRL',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          subscriptionId: 'SUB123456',
          subscriptionStatus: 'ACTIVE',
          validUntil: new Date('2025-01-15'),
          lastChecked: new Date()
        },
        {
          id: 'tx-002',
          transactionId: 'HT987654321',
          productId: 'PROD124',
          buyerEmail: 'carlos.santos@email.com',
          buyerName: 'Carlos Santos',
          status: 'APPROVED',
          value: 197.00,
          currency: 'BRL',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01'),
          validUntil: new Date('2024-08-01'), // Expired access
          lastChecked: new Date()
        },
        {
          id: 'tx-003',
          transactionId: 'HT456789123',
          productId: 'PROD125',
          buyerEmail: 'maria.oliveira@email.com',
          buyerName: 'Maria Oliveira',
          status: 'CANCELED',
          value: 397.00,
          currency: 'BRL',
          createdAt: new Date('2024-03-01'),
          updatedAt: new Date('2024-03-15'),
          subscriptionId: 'SUB456789',
          subscriptionStatus: 'CANCELED',
          lastChecked: new Date()
        },
        {
          id: 'tx-004',
          transactionId: 'HT789123456',
          productId: 'PROD126',
          buyerEmail: 'joao.costa@email.com',
          buyerName: 'João Costa',
          status: 'REFUNDED',
          value: 497.00,
          currency: 'BRL',
          createdAt: new Date('2024-02-15'),
          updatedAt: new Date('2024-03-01'),
          lastChecked: new Date()
        },
        {
          id: 'tx-005',
          transactionId: 'HT321654987',
          productId: 'PROD127',
          buyerEmail: 'lucia.ferreira@email.com',
          buyerName: 'Lúcia Ferreira',
          status: 'APPROVED',
          value: 247.00,
          currency: 'BRL',
          createdAt: new Date('2024-03-15'),
          updatedAt: new Date('2024-03-15'),
          subscriptionId: 'SUB321654',
          subscriptionStatus: 'ACTIVE',
          validUntil: new Date('2025-03-15'),
          lastChecked: new Date()
        }
      ];

      mockTransactions.forEach(transaction => {
        this.transactions.set(transaction.buyerEmail, transaction);
      });

      this.saveTransactions();
    }
  }

  /**
   * Validates if a user has access to Hotmart products based on their email
   */
  async validateUserAccess(userEmail: string): Promise<AccessValidationResult> {
    const transaction = this.transactions.get(userEmail.toLowerCase());
    
    if (!transaction) {
      return {
        hasAccess: false,
        reason: 'Nenhuma compra encontrada para este email',
        lastChecked: new Date()
      };
    }

    // Update last checked timestamp
    transaction.lastChecked = new Date();
    this.saveTransactions();

    // Check transaction status
    switch (transaction.status) {
      case 'APPROVED':
        // Check if access is still valid (for time-limited products)
        if (transaction.validUntil && transaction.validUntil < new Date()) {
          return {
            hasAccess: false,
            reason: 'Acesso expirado',
            transactionId: transaction.transactionId,
            validUntil: transaction.validUntil,
            lastChecked: new Date()
          };
        }

        // Check subscription status if applicable
        if (transaction.subscriptionId && transaction.subscriptionStatus) {
          if (transaction.subscriptionStatus === 'CANCELED' || 
              transaction.subscriptionStatus === 'OVERDUE') {
            return {
              hasAccess: false,
              reason: `Assinatura ${transaction.subscriptionStatus.toLowerCase()}`,
              transactionId: transaction.transactionId,
              subscriptionStatus: transaction.subscriptionStatus,
              lastChecked: new Date()
            };
          }
        }

        return {
          hasAccess: true,
          transactionId: transaction.transactionId,
          validUntil: transaction.validUntil,
          subscriptionStatus: transaction.subscriptionStatus,
          lastChecked: new Date()
        };

      case 'CANCELED':
        return {
          hasAccess: false,
          reason: 'Compra cancelada',
          transactionId: transaction.transactionId,
          lastChecked: new Date()
        };

      case 'REFUNDED':
        return {
          hasAccess: false,
          reason: 'Compra reembolsada',
          transactionId: transaction.transactionId,
          lastChecked: new Date()
        };

      case 'CHARGEBACK':
        return {
          hasAccess: false,
          reason: 'Chargeback realizado',
          transactionId: transaction.transactionId,
          lastChecked: new Date()
        };

      case 'BLOCKED':
        return {
          hasAccess: false,
          reason: 'Transação bloqueada',
          transactionId: transaction.transactionId,
          lastChecked: new Date()
        };

      default:
        return {
          hasAccess: false,
          reason: 'Status de transação desconhecido',
          transactionId: transaction.transactionId,
          lastChecked: new Date()
        };
    }
  }

  /**
   * Validates access for a specific product
   */
  async validateProductAccess(userEmail: string, productId: string): Promise<AccessValidationResult> {
    const generalAccess = await this.validateUserAccess(userEmail);
    
    if (!generalAccess.hasAccess) {
      return generalAccess;
    }

    const transaction = this.transactions.get(userEmail.toLowerCase());
    
    if (!transaction || transaction.productId !== productId) {
      return {
        hasAccess: false,
        reason: 'Usuário não possui acesso a este produto específico',
        lastChecked: new Date()
      };
    }

    return generalAccess;
  }

  /**
   * Gets purchase status for a user
   */
  getPurchaseStatus(userEmail: string): HotmartTransaction | null {
    return this.transactions.get(userEmail.toLowerCase()) || null;
  }

  /**
   * Updates transaction status (used by webhook service)
   */
  updateTransactionStatus(
    transactionId: string, 
    status: HotmartTransaction['status'],
    subscriptionStatus?: HotmartTransaction['subscriptionStatus']
  ): boolean {
    const entries = Array.from(this.transactions.entries());
    for (const [email, transaction] of entries) {
      if (transaction.transactionId === transactionId) {
        transaction.status = status;
        transaction.updatedAt = new Date();
        transaction.lastChecked = new Date();
        
        if (subscriptionStatus !== undefined) {
          transaction.subscriptionStatus = subscriptionStatus;
        }

        this.transactions.set(email, transaction);
        this.saveTransactions();
        return true;
      }
    }
    return false;
  }

  /**
   * Adds or updates a transaction (used by webhook service)
   */
  upsertTransaction(transaction: Omit<HotmartTransaction, 'id' | 'lastChecked'>): HotmartTransaction {
    const existingTransaction = this.transactions.get(transaction.buyerEmail.toLowerCase());
    
    const finalTransaction: HotmartTransaction = {
      ...transaction,
      id: existingTransaction?.id || `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastChecked: new Date(),
      buyerEmail: transaction.buyerEmail.toLowerCase()
    };

    this.transactions.set(transaction.buyerEmail.toLowerCase(), finalTransaction);
    this.saveTransactions();
    
    return finalTransaction;
  }

  /**
   * Periodic sync job to check transaction statuses with Hotmart API
   * In production, this would make actual API calls to Hotmart
   */
  async runSyncJob(): Promise<SyncJobResult> {
    const startTime = new Date();
    const result: SyncJobResult = {
      processedCount: 0,
      updatedCount: 0,
      blockedCount: 0,
      errors: [],
      startTime,
      endTime: new Date()
    };

    try {
      // In production, this would make API calls to Hotmart to check transaction statuses
      // For now, we'll simulate the sync process
      
      const entries = Array.from(this.transactions.entries());
      for (const [email, transaction] of entries) {
        result.processedCount++;

        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 100));

          // Mock logic: randomly update some transactions
          const shouldUpdate = Math.random() < 0.1; // 10% chance of update
          
          if (shouldUpdate) {
            // Simulate status changes
            const possibleStatuses: HotmartTransaction['status'][] = ['APPROVED', 'CANCELED', 'REFUNDED'];
            const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
            
            if (transaction.status !== randomStatus) {
              transaction.status = randomStatus;
              transaction.updatedAt = new Date();
              transaction.lastChecked = new Date();
              
              if (randomStatus === 'CANCELED' || randomStatus === 'REFUNDED') {
                transaction.subscriptionStatus = 'CANCELED';
                result.blockedCount++;
              }
              
              result.updatedCount++;
            }
          } else {
            // Just update last checked timestamp
            transaction.lastChecked = new Date();
          }

          this.transactions.set(email, transaction);
          
        } catch (error) {
          result.errors.push(`Erro ao sincronizar transação ${transaction.transactionId}: ${error}`);
        }
      }

      this.saveTransactions();
      
    } catch (error) {
      result.errors.push(`Erro geral no job de sincronização: ${error}`);
    }

    result.endTime = new Date();
    return result;
  }

  /**
   * Starts periodic sync job
   */
  private startPeriodicSync(): void {
    // Run initial sync after 5 minutes
    setTimeout(() => {
      this.runSyncJob().then(result => {
        console.log('Hotmart sync job completed:', result);
      }).catch(error => {
        console.error('Hotmart sync job failed:', error);
      });
    }, 5 * 60 * 1000);

    // Then run every 24 hours
    this.syncInterval = setInterval(() => {
      this.runSyncJob().then(result => {
        console.log('Hotmart periodic sync completed:', result);
      }).catch(error => {
        console.error('Hotmart periodic sync failed:', error);
      });
    }, this.SYNC_INTERVAL_MS);
  }

  /**
   * Stops periodic sync job
   */
  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
  }

  /**
   * Gets all transactions for admin dashboard
   */
  getAllTransactions(): HotmartTransaction[] {
    return Array.from(this.transactions.values()).sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  /**
   * Gets transactions by status
   */
  getTransactionsByStatus(status: HotmartTransaction['status']): HotmartTransaction[] {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.status === status)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Gets transactions that need attention (expired, canceled, etc.)
   */
  getTransactionsNeedingAttention(): HotmartTransaction[] {
    const now = new Date();
    return Array.from(this.transactions.values()).filter(transaction => {
      // Expired access
      if (transaction.validUntil && transaction.validUntil < now) {
        return true;
      }
      
      // Canceled or problem status
      if (['CANCELED', 'REFUNDED', 'CHARGEBACK', 'BLOCKED'].includes(transaction.status)) {
        return true;
      }
      
      // Subscription issues
      if (transaction.subscriptionStatus && 
          ['CANCELED', 'OVERDUE', 'DELAYED'].includes(transaction.subscriptionStatus)) {
        return true;
      }
      
      return false;
    }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Gets statistics for admin dashboard
   */
  getStatistics() {
    const allTransactions = Array.from(this.transactions.values());
    const total = allTransactions.length;
    
    const byStatus = {
      APPROVED: allTransactions.filter(t => t.status === 'APPROVED').length,
      CANCELED: allTransactions.filter(t => t.status === 'CANCELED').length,
      REFUNDED: allTransactions.filter(t => t.status === 'REFUNDED').length,
      CHARGEBACK: allTransactions.filter(t => t.status === 'CHARGEBACK').length,
      BLOCKED: allTransactions.filter(t => t.status === 'BLOCKED').length
    };

    const activeSubscriptions = allTransactions.filter(t => 
      t.subscriptionStatus === 'ACTIVE'
    ).length;

    const expiredAccess = allTransactions.filter(t => 
      t.validUntil && t.validUntil < new Date()
    ).length;

    const needingAttention = this.getTransactionsNeedingAttention().length;

    const totalRevenue = allTransactions
      .filter(t => t.status === 'APPROVED')
      .reduce((sum, t) => sum + t.value, 0);

    return {
      total,
      byStatus,
      activeSubscriptions,
      expiredAccess,
      needingAttention,
      totalRevenue
    };
  }
}

export const hotmartService = HotmartService.getInstance();