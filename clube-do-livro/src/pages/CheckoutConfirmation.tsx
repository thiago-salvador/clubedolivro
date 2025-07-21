import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/payment.service';
import { emailService } from '../services/email.service';
import { whatsappService } from '../services/whatsapp.service';

interface PaymentData {
  id: string;
  status: string;
  method: {
    type: string;
    details?: any;
  };
  amount: number;
  customer: {
    name: string;
    email: string;
  };
  boletoUrl?: string;
  boletoBarcode?: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
  installments?: number;
  phone?: string;
}

const CheckoutConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [pixCopied, setPixCopied] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Recuperar dados do pagamento
    const savedPayment = localStorage.getItem('lastPayment');
    if (savedPayment) {
      setPaymentData(JSON.parse(savedPayment));
      
      // Se for PIX ou boleto, verificar status periodicamente
      const payment = JSON.parse(savedPayment);
      if (payment.status === 'pending' && (payment.method.type === 'pix' || payment.method.type === 'boleto')) {
        const checkInterval = setInterval(async () => {
          setCheckingStatus(true);
          try {
            const updatedStatus = await paymentService.checkPaymentStatus(payment.id);
            if (updatedStatus.status === 'approved') {
              setPaymentData(prev => prev ? { ...prev, status: 'approved' } : null);
              clearInterval(checkInterval);
              
              // Enviar emails de confirmação
              if (payment.customer.email && payment.customer.name) {
                try {
                  // Email de confirmação de pagamento
                  await emailService.sendPaymentConfirmation(
                    payment.customer.email,
                    payment.customer.name,
                    {
                      amount: payment.amount,
                      method: getPaymentMethodName(payment.method.type),
                      transactionId: payment.id,
                      productName: 'Clube do Livro - Mulheres que Correm com os Lobos'
                    }
                  );
                  
                  // Email de boas-vindas
                  await emailService.sendWelcomeEmail(
                    payment.customer.email,
                    payment.customer.name
                  );
                  
                  // WhatsApp de confirmação e convite para grupo
                  if (payment.phone) {
                    try {
                      await whatsappService.sendPaymentConfirmation(
                        payment.phone,
                        payment.customer.name,
                        payment.amount,
                        payment.id
                      );
                      await whatsappService.sendGroupInvite(payment.phone, 'main_group');
                    } catch (whatsappError) {
                      console.error('Erro ao enviar WhatsApp:', whatsappError);
                    }
                  }
                } catch (error) {
                  console.error('Erro ao enviar emails:', error);
                }
              }
            }
          } catch (error) {
            console.error('Erro ao verificar status:', error);
          } finally {
            setCheckingStatus(false);
          }
        }, 3000); // Verificar a cada 3 segundos
        
        // Limpar intervalo após 5 minutos
        setTimeout(() => clearInterval(checkInterval), 300000);
        
        return () => clearInterval(checkInterval);
      }
    }
  }, []);

  const copyPixCode = () => {
    if (paymentData?.pixCopyPaste) {
      navigator.clipboard.writeText(paymentData.pixCopyPaste);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 3000);
    }
  };

  const getPaymentMethodName = (type: string) => {
    switch (type) {
      case 'credit_card': return 'Cartão de Crédito';
      case 'pix': return 'PIX';
      case 'boleto': return 'Boleto Bancário';
      default: return type;
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Nenhuma informação de pagamento encontrada.</p>
          <button
            onClick={() => navigate('/')}
            className="text-terracota hover:underline"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          {/* Header baseado no status */}
          {paymentData.status === 'approved' ? (
            <div className="text-center mb-8">
              <div className="text-green-500 text-6xl lg:text-8xl mx-auto mb-6">✅</div>
              <h1 className="text-3xl lg:text-4xl font-elegant font-light text-gray-800 mb-4">
                Pagamento Confirmado!
              </h1>
              <p className="text-xl text-gray-600">
                Bem-vinda ao Clube do Livro Mulheres que Correm com os Lobos
              </p>
            </div>
          ) : paymentData.status === 'pending' ? (
            <div className="text-center mb-8">
              <div className="text-yellow-500 text-6xl lg:text-8xl mx-auto mb-6">⏳</div>
              <h1 className="text-3xl lg:text-4xl font-elegant font-light text-gray-800 mb-4">
                Aguardando Pagamento
              </h1>
              <p className="text-xl text-gray-600">
                Sua inscrição será confirmada assim que o pagamento for processado
              </p>
              {checkingStatus && (
                <p className="text-sm text-gray-500 mt-2">
                  🔄 Verificando status do pagamento...
                </p>
              )}
            </div>
          ) : (
            <div className="text-center mb-8">
              <div className="text-red-500 text-6xl lg:text-8xl mx-auto mb-6">❌</div>
              <h1 className="text-3xl lg:text-4xl font-elegant font-light text-gray-800 mb-4">
                Pagamento não processado
              </h1>
              <p className="text-xl text-gray-600">
                Houve um problema com seu pagamento. Por favor, tente novamente.
              </p>
            </div>
          )}

          {/* Instruções específicas por método de pagamento */}
          {paymentData.status === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              {paymentData.method.type === 'pix' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    Complete o pagamento via PIX
                  </h3>
                  
                  {paymentData.pixQrCode && (
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600 mb-2">Escaneie o QR Code:</p>
                      <div className="bg-white p-4 rounded-lg inline-block">
                        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">QR Code PIX</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentData.pixCopyPaste && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Ou copie o código PIX:</p>
                      <div className="bg-gray-100 p-3 rounded-lg break-all text-xs font-mono mb-3">
                        {paymentData.pixCopyPaste}
                      </div>
                      <button
                        onClick={copyPixCode}
                        className="w-full bg-terracota text-white py-2 rounded-lg hover:bg-marrom-escuro transition-colors"
                      >
                        {pixCopied ? '✅ Copiado!' : '📋 Copiar código PIX'}
                      </button>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mt-4">
                    ⚡ O pagamento é processado instantaneamente após a confirmação
                  </p>
                </div>
              )}

              {paymentData.method.type === 'boleto' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📄</span>
                    Pague o boleto até o vencimento
                  </h3>
                  
                  {paymentData.boletoBarcode && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Código de barras:</p>
                      <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm break-all">
                        {paymentData.boletoBarcode}
                      </div>
                    </div>
                  )}
                  
                  <a
                    href={paymentData.boletoUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-terracota text-white py-3 rounded-lg text-center hover:bg-marrom-escuro transition-colors"
                  >
                    📥 Baixar Boleto
                  </a>
                  
                  <p className="text-sm text-gray-600 mt-4">
                    💡 Após o pagamento, sua inscrição será liberada em até 2 dias úteis
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Próximos passos para pagamento aprovado */}
          {paymentData.status === 'approved' && (
            <div className="bg-rose-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Próximos passos:
              </h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-terracota mt-1 flex-shrink-0">📧</span>
                  <div>
                    <p className="font-medium text-gray-800">Verifique seu e-mail</p>
                    <p className="text-gray-600 text-sm">
                      Enviamos suas credenciais de acesso e todas as informações importantes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 mt-1 flex-shrink-0">💬</span>
                  <div>
                    <p className="font-medium text-gray-800">Entre no grupo do WhatsApp</p>
                    <p className="text-gray-600 text-sm">
                      O link está no e-mail que você recebeu
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1 flex-shrink-0">📚</span>
                  <div>
                    <p className="font-medium text-gray-800">Acesse a área da aluna</p>
                    <p className="text-gray-600 text-sm">
                      Todo o conteúdo já está disponível para você
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dados da compra */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Dados da sua compra:
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{paymentData.customer.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">E-mail:</span>
                  <span className="font-medium text-sm">{paymentData.customer.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Produto:</span>
                  <span className="font-medium">Clube do Livro</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-medium">
                    R$ {paymentData.amount.toFixed(2)}
                    {paymentData.installments && paymentData.installments > 1 && 
                      ` (${paymentData.installments}x)`
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Forma de pagamento:</span>
                  <span className="font-medium">{getPaymentMethodName(paymentData.method.type)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    paymentData.status === 'approved' ? 'text-green-600' :
                    paymentData.status === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {paymentData.status === 'approved' ? '✅ Aprovado' :
                     paymentData.status === 'pending' ? '⏳ Aguardando' :
                     '❌ Não processado'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ID da transação:</span>
                  <span className="font-mono text-xs">{paymentData.id}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {paymentData.status === 'approved' ? (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-terracota hover:bg-marrom-escuro text-white font-semibold text-lg py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    ACESSAR ÁREA DA ALUNA
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="text-gray-600 hover:text-gray-800 underline"
                  >
                    Voltar para a página inicial
                  </button>
                </>
              ) : paymentData.status === 'failed' ? (
                <>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-terracota hover:bg-marrom-escuro text-white font-semibold text-lg py-4 rounded-full transition-all duration-300"
                  >
                    TENTAR NOVAMENTE
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="text-gray-600 hover:text-gray-800 underline"
                  >
                    Voltar para a página inicial
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-gray-800 underline"
                >
                  Voltar para a página inicial
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Dúvidas? Entre em contato conosco:</p>
          <p>contato@clubedolivro.com.br</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;