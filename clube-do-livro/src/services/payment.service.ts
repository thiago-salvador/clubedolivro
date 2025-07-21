// Simulação de um serviço de pagamento
// Este arquivo pode ser facilmente substituído por integrações reais (Stripe, PagSeguro, etc)

interface PaymentMethod {
  type: 'credit_card' | 'boleto' | 'pix';
  details?: any;
}

interface CreditCardData {
  number: string;
  name: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cpf: string;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customer: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
  };
  method: PaymentMethod;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

interface PaymentResponse {
  id: string;
  status: 'pending' | 'processing' | 'approved' | 'failed';
  method: PaymentMethod;
  amount: number;
  currency: string;
  createdAt: Date;
  paidAt?: Date;
  boletoUrl?: string;
  boletoBarcode?: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
  receipt?: {
    number: string;
    url: string;
  };
  errorMessage?: string;
}

// Simular delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Validar número de cartão (algoritmo de Luhn simplificado)
const validateCreditCard = (number: string): boolean => {
  const cleaned = number.replace(/\s/g, '');
  if (!/^\d{16}$/.test(cleaned)) return false;
  
  // Simulação: cartões que começam com 4 (Visa) ou 5 (Mastercard) são válidos
  return cleaned.startsWith('4') || cleaned.startsWith('5');
};

// Validar CPF (simplificado)
const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.length === 11;
};

// Gerar código de barras para boleto
const generateBoletoBarcode = (): string => {
  const banco = '001'; // Banco do Brasil
  const moeda = '9';
  const dv = Math.floor(Math.random() * 10);
  const fatorVencimento = '9139'; // Data de vencimento codificada
  const valor = '0000029700'; // R$ 297,00
  const nossoNumero = Math.random().toString().slice(2, 19);
  
  return `${banco}${moeda}${dv}.${fatorVencimento} ${valor}${nossoNumero}`;
};

// Gerar QR Code PIX (simulado)
const generatePixCode = (): { qrCode: string; copyPaste: string } => {
  const pixKey = '00020126360014BR.GOV.BCB.PIX0114clube@livro.com';
  const amount = '5204000053039865405297.005802BR';
  const merchantName = '5913CLUBE DO LIVRO6009SAO PAULO';
  const txId = '62070503***63046A7C';
  
  const copyPaste = pixKey + amount + merchantName + txId;
  
  return {
    qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`, // Placeholder
    copyPaste
  };
};

export const paymentService = {
  // Processar pagamento com cartão de crédito
  async processCreditCard(data: PaymentRequest & { cardData: CreditCardData }): Promise<PaymentResponse> {
    await delay(2000); // Simula processamento
    
    // Validações
    if (!validateCreditCard(data.cardData.number)) {
      throw new Error('Número de cartão inválido');
    }
    
    if (!validateCPF(data.cardData.cpf)) {
      throw new Error('CPF inválido');
    }
    
    const expiryDate = new Date(
      parseInt('20' + data.cardData.expiryYear),
      parseInt(data.cardData.expiryMonth) - 1
    );
    
    if (expiryDate < new Date()) {
      throw new Error('Cartão expirado');
    }
    
    // Simular aprovação (90% de chance de sucesso)
    const approved = Math.random() > 0.1;
    
    if (!approved) {
      return {
        id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'failed',
        method: { type: 'credit_card' },
        amount: data.amount,
        currency: data.currency,
        createdAt: new Date(),
        errorMessage: 'Transação não autorizada pela operadora do cartão'
      };
    }
    
    // Pagamento aprovado
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: paymentId,
      status: 'approved',
      method: {
        type: 'credit_card',
        details: {
          last4: data.cardData.number.slice(-4),
          brand: data.cardData.number.startsWith('4') ? 'Visa' : 'Mastercard'
        }
      },
      amount: data.amount,
      currency: data.currency,
      createdAt: new Date(),
      paidAt: new Date(),
      receipt: {
        number: `REC-${Date.now()}`,
        url: `/receipts/${paymentId}`
      }
    };
  },

  // Gerar boleto
  async generateBoleto(data: PaymentRequest): Promise<PaymentResponse> {
    await delay(1500);
    
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const barcode = generateBoletoBarcode();
    
    return {
      id: paymentId,
      status: 'pending',
      method: { type: 'boleto' },
      amount: data.amount,
      currency: data.currency,
      createdAt: new Date(),
      boletoUrl: `/boletos/${paymentId}`,
      boletoBarcode: barcode
    };
  },

  // Gerar PIX
  async generatePix(data: PaymentRequest): Promise<PaymentResponse> {
    await delay(1000);
    
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const pixData = generatePixCode();
    
    return {
      id: paymentId,
      status: 'pending',
      method: { type: 'pix' },
      amount: data.amount,
      currency: data.currency,
      createdAt: new Date(),
      pixQrCode: pixData.qrCode,
      pixCopyPaste: pixData.copyPaste
    };
  },

  // Verificar status do pagamento
  async checkPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    await delay(500);
    
    // Simular que pagamentos PIX e boleto são confirmados após 5 segundos
    const now = Date.now();
    const paymentTime = parseInt(paymentId.split('_')[1]);
    const elapsed = now - paymentTime;
    
    if (elapsed > 5000) {
      return {
        id: paymentId,
        status: 'approved',
        method: { type: 'pix' }, // Simplificado
        amount: 297,
        currency: 'BRL',
        createdAt: new Date(paymentTime),
        paidAt: new Date(paymentTime + 5000),
        receipt: {
          number: `REC-${paymentTime}`,
          url: `/receipts/${paymentId}`
        }
      };
    }
    
    return {
      id: paymentId,
      status: 'pending',
      method: { type: 'pix' },
      amount: 297,
      currency: 'BRL',
      createdAt: new Date(paymentTime)
    };
  },

  // Enviar comprovante por email (simulado)
  async sendReceipt(paymentId: string, email: string): Promise<boolean> {
    await delay(1000);
    
    console.log(`Comprovante ${paymentId} enviado para ${email}`);
    
    // Em produção, integraria com serviço de email
    return true;
  },

  // Validar cupom de desconto
  async validateCoupon(code: string): Promise<{ valid: boolean; discount?: number; type?: 'percentage' | 'fixed' }> {
    await delay(500);
    
    const coupons: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
      'BEMVINDA10': { discount: 10, type: 'percentage' },
      'AMIGA50': { discount: 50, type: 'fixed' },
      'CLUBE2024': { discount: 20, type: 'percentage' }
    };
    
    const coupon = coupons[code.toUpperCase()];
    
    if (!coupon) {
      return { valid: false };
    }
    
    return {
      valid: true,
      discount: coupon.discount,
      type: coupon.type
    };
  }
};