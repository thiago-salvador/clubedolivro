import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import { authService } from '../../services/auth.service';
import { hotmartService } from '../../services/hotmart.service';
import { webhookService } from '../../services/webhook.service';
import { studentService } from '../../services/student.service';

// Mock services
jest.mock('../../services/auth.service');
jest.mock('../../services/hotmart.service');
jest.mock('../../services/webhook.service');
jest.mock('../../services/student.service');

describe('Hotmart Integration Flow', () => {
  const mockAdminUser = {
    id: '1',
    name: 'Admin User',
    email: 'admin@clubedolivro.com',
    role: 'ADMIN' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTransactions = [
    {
      id: 'trans1',
      email: 'customer@example.com',
      productId: 'prod_123',
      productName: 'Curso Premium',
      transactionId: 'hotmart_123',
      status: 'APPROVED' as const,
      purchaseDate: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      amount: 197.00,
      subscription: {
        status: 'ACTIVE' as const,
        canceledAt: null
      },
      lastChecked: new Date()
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup auth mock
    (authService.getAuthenticatedUser as jest.Mock).mockReturnValue(mockAdminUser);
    (authService.isAdmin as jest.Mock).mockReturnValue(true);
    
    // Setup Hotmart service mock
    (hotmartService.getAllTransactions as jest.Mock).mockResolvedValue(mockTransactions);
    (hotmartService.getStatistics as jest.Mock).mockResolvedValue({
      totalTransactions: 1,
      approvedTransactions: 1,
      canceledTransactions: 0,
      refundedTransactions: 0,
      totalRevenue: 197.00,
      activeSubscriptions: 1,
      canceledSubscriptions: 0,
      transactionsNeedingAttention: 0
    });
  });

  it('should display Hotmart dashboard with statistics', async () => {
    render(
      <BrowserRouter initialEntries={['/admin/hotmart']}>
        <App />
      </BrowserRouter>
    );

    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText('Integração Hotmart')).toBeInTheDocument();
    });

    // Check statistics are displayed
    expect(screen.getByText('1')).toBeInTheDocument(); // Total transactions
    expect(screen.getByText('R$ 197,00')).toBeInTheDocument(); // Revenue
    expect(screen.getByText('Ativa')).toBeInTheDocument(); // Subscription status

    // Check transaction details
    expect(screen.getByText('customer@example.com')).toBeInTheDocument();
    expect(screen.getByText('Curso Premium')).toBeInTheDocument();
  });

  it('should test webhook processing', async () => {
    const mockWebhookData = {
      event: 'PURCHASE_COMPLETED',
      data: {
        product: {
          id: 'prod_123',
          name: 'Curso Premium'
        },
        buyer: {
          email: 'newcustomer@example.com',
          name: 'New Customer'
        },
        purchase: {
          transaction: 'hotmart_456',
          status: 'approved',
          payment: {
            type: 'credit_card',
            installments_number: 1
          }
        }
      }
    };

    (webhookService.processWebhook as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Webhook processado com sucesso'
    });

    render(
      <BrowserRouter initialEntries={['/admin/hotmart']}>
        <App />
      </BrowserRouter>
    );

    // Navigate to webhook tester tab
    const webhookTab = await screen.findByText('Testar Webhook');
    fireEvent.click(webhookTab);

    // Wait for webhook tester to load
    await waitFor(() => {
      expect(screen.getByText('Webhook Tester')).toBeInTheDocument();
    });

    // Select event type
    const eventSelect = screen.getByLabelText('Tipo de Evento');
    fireEvent.change(eventSelect, { target: { value: 'PURCHASE_COMPLETED' } });

    // Fill webhook data
    const dataTextarea = screen.getByLabelText('Dados do Webhook (JSON)');
    fireEvent.change(dataTextarea, { 
      target: { value: JSON.stringify(mockWebhookData.data, null, 2) } 
    });

    // Send test webhook
    const sendButton = screen.getByRole('button', { name: 'Enviar Teste' });
    fireEvent.click(sendButton);

    // Should process webhook
    await waitFor(() => {
      expect(webhookService.processWebhook).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'PURCHASE_COMPLETED',
          data: mockWebhookData.data
        })
      );
    });

    // Should show success message
    expect(screen.getByText('Webhook processado com sucesso')).toBeInTheDocument();
  });

  it('should handle purchase cancellation webhook', async () => {
    const cancellationWebhook = {
      event: 'PURCHASE_CANCELED',
      data: {
        product: { id: 'prod_123' },
        buyer: { email: 'customer@example.com' },
        purchase: { transaction: 'hotmart_123' }
      }
    };

    (webhookService.processWebhook as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Compra cancelada e acesso removido'
    });

    (studentService.getStudentsByFilter as jest.Mock).mockResolvedValue([{
      id: 'student1',
      email: 'customer@example.com',
      isActive: true
    }]);

    (studentService.updateStudent as jest.Mock).mockResolvedValue(true);

    render(
      <BrowserRouter initialEntries={['/admin/hotmart']}>
        <App />
      </BrowserRouter>
    );

    // Navigate to webhook tester
    const webhookTab = await screen.findByText('Testar Webhook');
    fireEvent.click(webhookTab);

    // Send cancellation webhook
    const eventSelect = screen.getByLabelText('Tipo de Evento');
    fireEvent.change(eventSelect, { target: { value: 'PURCHASE_CANCELED' } });

    const dataTextarea = screen.getByLabelText('Dados do Webhook (JSON)');
    fireEvent.change(dataTextarea, { 
      target: { value: JSON.stringify(cancellationWebhook.data, null, 2) } 
    });

    const sendButton = screen.getByRole('button', { name: 'Enviar Teste' });
    fireEvent.click(sendButton);

    // Should process cancellation
    await waitFor(() => {
      expect(webhookService.processWebhook).toHaveBeenCalled();
      expect(screen.getByText('Compra cancelada e acesso removido')).toBeInTheDocument();
    });
  });

  it('should validate webhook signature', async () => {
    render(
      <BrowserRouter initialEntries={['/admin/hotmart']}>
        <App />
      </BrowserRouter>
    );

    // Navigate to configuration tab
    const configTab = await screen.findByText('Configurações');
    fireEvent.click(configTab);

    // Check webhook configuration
    await waitFor(() => {
      expect(screen.getByText('URL do Webhook')).toBeInTheDocument();
      expect(screen.getByText('Chave Secreta')).toBeInTheDocument();
    });

    // Update webhook secret
    const secretInput = screen.getByLabelText('Chave Secreta');
    fireEvent.change(secretInput, { target: { value: 'new-secret-key' } });

    // Save configuration
    const saveButton = screen.getByRole('button', { name: 'Salvar Configurações' });
    fireEvent.click(saveButton);

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText('Configurações salvas com sucesso')).toBeInTheDocument();
    });
  });

  it('should sync transactions periodically', async () => {
    const updatedTransactions = [
      ...mockTransactions,
      {
        id: 'trans2',
        email: 'another@example.com',
        productId: 'prod_456',
        productName: 'Outro Curso',
        transactionId: 'hotmart_789',
        status: 'APPROVED' as const,
        purchaseDate: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        amount: 297.00,
        lastChecked: new Date()
      }
    ];

    (hotmartService.syncTransactions as jest.Mock).mockResolvedValue({
      success: true,
      synced: 2,
      errors: 0
    });

    (hotmartService.getAllTransactions as jest.Mock)
      .mockResolvedValueOnce(mockTransactions)
      .mockResolvedValueOnce(updatedTransactions);

    render(
      <BrowserRouter initialEntries={['/admin/hotmart']}>
        <App />
      </BrowserRouter>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('customer@example.com')).toBeInTheDocument();
    });

    // Click sync button
    const syncButton = screen.getByRole('button', { name: /Sincronizar/i });
    fireEvent.click(syncButton);

    // Should call sync service
    await waitFor(() => {
      expect(hotmartService.syncTransactions).toHaveBeenCalled();
    });

    // Should update transaction list
    await waitFor(() => {
      expect(screen.getByText('another@example.com')).toBeInTheDocument();
    });
  });

  it('should export transaction history', async () => {
    // Mock CSV download
    const mockLink = document.createElement('a');
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
    jest.spyOn(mockLink, 'click').mockImplementation();

    render(
      <BrowserRouter initialEntries={['/admin/hotmart']}>
        <App />
      </BrowserRouter>
    );

    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText('customer@example.com')).toBeInTheDocument();
    });

    // Click export button
    const exportButton = screen.getByRole('button', { name: /Exportar CSV/i });
    fireEvent.click(exportButton);

    // Should create and download CSV
    await waitFor(() => {
      expect(mockLink.download).toContain('hotmart-transactions');
      expect(mockLink.download).toContain('.csv');
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});