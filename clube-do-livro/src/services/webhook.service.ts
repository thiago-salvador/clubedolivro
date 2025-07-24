/**
 * Webhook Service - Handles Hotmart webhook processing
 * 
 * This service provides the logic that would be used in a backend endpoint
 * For development/testing, includes mock functions and local simulation
 */

import { HotmartWebhookData, WebhookResponse, HotmartTransaction } from '../types/webhook.types';
import { User, UserRole } from '../types';
import { authService } from './auth.service';
import { studentService } from './student.service';
import { tagService } from './tag.service';
import { emailService } from './email.service';

/**
 * Mock webhook endpoint that simulates backend processing
 * In production, this would be handled by a backend server at /api/webhooks/hotmart
 */
class WebhookService {
  private readonly HOTMART_SECRET = process.env.REACT_APP_HOTMART_SECRET || 'mock-secret-key';
  private transactions: HotmartTransaction[] = [];

  constructor() {
    this.loadTransactions();
  }

  /**
   * Main webhook processing function
   * This would be called by the backend endpoint when receiving a webhook
   */
  async processHotmartWebhook(
    payload: HotmartWebhookData,
    signature?: string
  ): Promise<WebhookResponse> {
    try {
      console.log('🔄 Processing Hotmart webhook:', payload.event);

      // 1. Validate signature (in production)
      if (signature && !this.validateSignature(payload, signature)) {
        return {
          success: false,
          error: 'Invalid signature',
          code: 'INVALID_SIGNATURE'
        };
      }

      // 2. Process based on event type
      switch (payload.event) {
        case 'PURCHASE_COMPLETED':
          return await this.handlePurchaseCompleted(payload);
        
        case 'PURCHASE_CANCELED':
          return await this.handlePurchaseCanceled(payload);
        
        case 'PURCHASE_REFUNDED':
          return await this.handlePurchaseRefunded(payload);
        
        case 'SUBSCRIPTION_CANCELED':
          return await this.handleSubscriptionCanceled(payload);
        
        default:
          console.log(`⚠️ Unhandled webhook event: ${payload.event}`);
          return {
            success: true,
            message: `Event ${payload.event} acknowledged but not processed`
          };
      }

    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'PROCESSING_ERROR'
      };
    }
  }

  /**
   * Validates Hotmart webhook signature
   */
  private validateSignature(payload: HotmartWebhookData, signature: string): boolean {
    // In production, implement proper HMAC SHA256 validation
    // const expectedSignature = crypto
    //   .createHmac('sha256', this.HOTMART_SECRET)
    //   .update(JSON.stringify(payload))
    //   .digest('hex');
    
    // For development, accept any signature or mock validation
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    
    // Mock validation - replace with proper crypto validation
    return signature === `sha256=${this.HOTMART_SECRET}`;
  }

  /**
   * Handles completed purchase webhook
   */
  private async handlePurchaseCompleted(payload: HotmartWebhookData): Promise<WebhookResponse> {
    const { buyer, product, transaction } = payload.data;

    try {
      // Save transaction for logging
      const transactionRecord: HotmartTransaction = {
        id: transaction.transaction_id,
        hotmartId: transaction.transaction_id,
        event: 'PURCHASE_COMPLETED',
        productId: product.id.toString(),
        productName: product.name,
        buyerEmail: buyer.email,
        buyerName: buyer.name,
        amount: transaction.value,
        currency: 'BRL',
        status: 'completed',
        processedAt: new Date(),
        createdAt: new Date(transaction.purchase_date)
      };

      this.transactions.push(transactionRecord);
      this.saveTransactions();

      // Check if user already exists
      let user = authService.getUserByEmail(buyer.email);
      
      if (!user) {
        // Create new user
        user = await this.createUserFromPurchase(buyer, product);
        console.log('✅ New user created:', user.email);
      } else {
        console.log('👤 Existing user found:', user.email);
      }

      // Assign product tags
      await this.assignProductTags(user, product);

      // Send welcome email
      await this.sendWelcomeEmail(user, product, !authService.getUserByEmail(buyer.email));

      return {
        success: true,
        message: 'Purchase processed successfully',
        data: {
          userId: user.id,
          userEmail: user.email,
          productId: product.id.toString()
        }
      };

    } catch (error) {
      console.error('❌ Error processing purchase:', error);
      throw error;
    }
  }

  /**
   * Handles canceled purchase webhook
   */
  private async handlePurchaseCanceled(payload: HotmartWebhookData): Promise<WebhookResponse> {
    const { buyer, transaction } = payload.data;

    // Find and deactivate user
    const user = authService.getUserByEmail(buyer.email);
    if (user) {
      // Update user status via student service
      const studentWithTags = studentService.getStudentById(user.id);
      if (studentWithTags) {
        await studentService.updateStudent(user.id, {
          ...studentWithTags,
          isActive: false
        });
        console.log('🚫 User deactivated due to cancellation:', user.email);
      }
    }

    // Log transaction
    const transactionRecord: HotmartTransaction = {
      id: transaction.transaction_id,
      hotmartId: transaction.transaction_id,
      event: 'PURCHASE_CANCELED',
      productId: payload.data.product.id.toString(),
      productName: payload.data.product.name,
      buyerEmail: buyer.email,
      buyerName: buyer.name,
      amount: transaction.value,
      currency: 'BRL',
      status: 'canceled',
      processedAt: new Date(),
      createdAt: new Date(transaction.purchase_date)
    };

    this.transactions.push(transactionRecord);
    this.saveTransactions();

    return {
      success: true,
      message: 'Cancellation processed successfully'
    };
  }

  /**
   * Handles refunded purchase webhook
   */
  private async handlePurchaseRefunded(payload: HotmartWebhookData): Promise<WebhookResponse> {
    // Similar to cancellation, but might need different handling
    return await this.handlePurchaseCanceled(payload);
  }

  /**
   * Handles subscription cancellation webhook
   */
  private async handleSubscriptionCanceled(payload: HotmartWebhookData): Promise<WebhookResponse> {
    return await this.handlePurchaseCanceled(payload);
  }

  /**
   * Creates a new user from purchase data
   */
  private async createUserFromPurchase(buyer: any, product: any): Promise<User> {
    // Generate temporary password
    const tempPassword = this.generateTempPassword();
    
    const newUser: User = {
      id: crypto.randomUUID(),
      name: buyer.name,
      email: buyer.email,
      avatar: undefined,
      role: UserRole.ALUNA,
      badges: [],
      joinedDate: new Date(),
      previousParticipations: []
    };

    // Register user through auth service
    authService.register({
      name: newUser.name,
      email: newUser.email,
      password: tempPassword,
      cpf: '', // Not required for Hotmart users
      phone: buyer.phone || ''
    });

    // Add to student service with additional fields
    studentService.createStudent({
      ...newUser,
      tags: [],
      lastActivity: new Date(),
      coursesEnrolled: 1, // Starting with one course
      isActive: true,
      phoneNumber: buyer.phone || '',
      notes: `Created automatically from Hotmart purchase - Product: ${product.name}`
    });

    return newUser;
  }

  /**
   * Assigns product tags to user based on purchase
   */
  private async assignProductTags(user: User, product: any): Promise<void> {
    // Get product-tag associations
    const associations = JSON.parse(localStorage.getItem('tag_product_associations') || '[]');
    const productAssociations = associations.filter((assoc: any) => 
      assoc.hotmartProductId === product.id.toString() && assoc.isActive
    );

    if (productAssociations.length === 0) {
      console.log('⚠️ No tag associations found for product:', product.name);
      return;
    }

    // Get all available tags
    const allTags = JSON.parse(localStorage.getItem('product_tags') || '[]');
    
    // Create system user for automatic assignment
    const systemUser: User = {
      id: 'system',
      name: 'Sistema Hotmart',
      email: 'system@hotmart.com',
      role: UserRole.ADMIN,
      avatar: undefined,
      badges: [],
      joinedDate: new Date(),
      previousParticipations: []
    };

    // Add tags to user
    for (const association of productAssociations) {
      try {
        const tag = allTags.find((t: any) => t.id === association.tagId);
        if (tag) {
          studentService.addTagToStudent(user.id, tag, systemUser);
          console.log(`🏷️ Tag ${tag.name} assigned to user ${user.email}`);
        }
      } catch (error) {
        console.error(`❌ Error assigning tag ${association.tagId}:`, error);
      }
    }
  }

  /**
   * Sends welcome email to new user
   */
  private async sendWelcomeEmail(user: User, product: any, isNewUser: boolean): Promise<void> {
    const templateData = {
      userName: user.name,
      userEmail: user.email,
      productName: product.name,
      loginUrl: `${window.location.origin}/login`,
      supportEmail: 'suporte@clubedolivronodiva.com',
      welcomeMessage: isNewUser 
        ? 'Bem-vinda ao Clube do Livro no Divã! Sua conta foi criada automaticamente.'
        : 'Obrigada por sua nova compra! Seu acesso foi atualizado.',
      isNewUser
    };

    try {
      await emailService.sendEmail({
        to: user.email,
        template: 'hotmart_welcome',
        data: templateData
      });
      console.log('📧 Welcome email sent to:', user.email);
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
    }
  }

  /**
   * Generates a temporary password for new users
   */
  private generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Gets all processed transactions
   */
  getTransactions(): HotmartTransaction[] {
    return [...this.transactions];
  }

  /**
   * Gets transactions by email
   */
  getTransactionsByEmail(email: string): HotmartTransaction[] {
    return this.transactions.filter(t => t.buyerEmail === email);
  }

  /**
   * Mock function to simulate webhook call (for testing)
   */
  async simulateWebhook(mockData: Partial<HotmartWebhookData>): Promise<WebhookResponse> {
    const defaultMockData: HotmartWebhookData = {
      event: 'PURCHASE_COMPLETED',
      data: {
        buyer: {
          name: 'Maria Silva',
          email: 'maria.silva@example.com',
          phone: '(11) 99999-9999'
        },
        product: {
          id: 123456,
          name: 'Clube do Livro no Divã - Acesso Completo'
        },
        transaction: {
          transaction_id: 'TXN_' + Date.now(),
          value: 197.00,
          purchase_date: new Date().toISOString()
        }
      },
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    };

    const webhookData = { ...defaultMockData, ...mockData };
    return await this.processHotmartWebhook(webhookData);
  }

  private loadTransactions(): void {
    const saved = localStorage.getItem('hotmart_transactions');
    if (saved) {
      this.transactions = JSON.parse(saved).map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        processedAt: new Date(t.processedAt)
      }));
    }
  }

  private saveTransactions(): void {
    localStorage.setItem('hotmart_transactions', JSON.stringify(this.transactions));
  }
}

export const webhookService = new WebhookService();