import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/payment.service';
import { emailService } from '../services/email.service';
import { whatsappService } from '../services/whatsapp.service';

interface FormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  acceptTerms: boolean;
  paymentMethod: 'credit_card' | 'boleto' | 'pix';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  installments?: number;
  couponCode?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  acceptTerms?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'product' | 'form' | 'payment'>('product');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    acceptTerms: false,
    paymentMethod: 'credit_card',
    installments: 1
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<{ amount: number; type: 'percentage' | 'fixed' } | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const basePrice = 497;
  const discountedPrice = 297;
  
  const finalPrice = couponDiscount
    ? couponDiscount.type === 'percentage'
      ? discountedPrice * (1 - couponDiscount.amount / 100)
      : discountedPrice - couponDiscount.amount
    : discountedPrice;

  const benefits = [
    { icon: '📚', text: '17 semanas de um mergulho profundo em si mesma' },
    { icon: '🎥', text: '17 vídeo aulas com análises de cada capítulo' },
    { icon: '✍️', text: '17 exercícios terapêuticos pra aprofundar o que foi lido' },
    { icon: '🎵', text: '17 músicas pra embalar e provocar cada etapa da leitura' },
    { icon: '👥', text: '17 encontros online interativos e ao vivo' },
    { icon: '💬', text: 'Comunidade exclusiva para conexões e trocas genuínas' },
    { icon: '🎁', text: 'Descontos exclusivos em marcas parceiras' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'cpf') {
      setFormData(prev => ({ ...prev, cpf: formatCPF(value) }));
    } else if (name === 'phone') {
      setFormData(prev => ({ ...prev, phone: formatPhone(value) }));
    } else if (name === 'cardNumber') {
      setFormData(prev => ({ ...prev, cardNumber: formatCardNumber(value) }));
    } else if (name === 'cardExpiry') {
      setFormData(prev => ({ ...prev, cardExpiry: formatCardExpiry(value) }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const formatCardExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 4)
      .replace(/(\d{2})(\d)/, '$1/$2');
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Você deve aceitar os termos';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: FormErrors = {};

    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Número do cartão é obrigatório';
      else if (formData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Número do cartão inválido';
      
      if (!formData.cardName) newErrors.cardName = 'Nome no cartão é obrigatório';
      
      if (!formData.cardExpiry) newErrors.cardExpiry = 'Data de validade é obrigatória';
      else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) newErrors.cardExpiry = 'Data inválida';
      
      if (!formData.cardCvv) newErrors.cardCvv = 'CVV é obrigatório';
      else if (!/^\d{3,4}$/.test(formData.cardCvv)) newErrors.cardCvv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPaymentMethodName = (type: string) => {
    switch (type) {
      case 'credit_card': return 'Cartão de Crédito';
      case 'pix': return 'PIX';
      case 'boleto': return 'Boleto Bancário';
      default: return type;
    }
  };

  const handleApplyCoupon = async () => {
    if (!formData.couponCode) return;
    
    setIsLoading(true);
    try {
      const result = await paymentService.validateCoupon(formData.couponCode);
      if (result.valid && result.discount && result.type) {
        setCouponDiscount({ amount: result.discount, type: result.type });
        setAppliedCoupon(formData.couponCode.toUpperCase());
      } else {
        alert('Cupom inválido');
      }
    } catch (error) {
      alert('Erro ao validar cupom');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    setIsLoading(true);
    setPaymentError('');

    try {
      const paymentData = {
        amount: finalPrice,
        currency: 'BRL',
        description: 'Clube do Livro - Mulheres que Correm com os Lobos',
        customer: {
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf.replace(/\D/g, ''),
          phone: formData.phone.replace(/\D/g, '')
        },
        method: { type: formData.paymentMethod as 'credit_card' | 'boleto' | 'pix' },
        items: [{
          name: 'Clube do Livro - Acesso Completo',
          quantity: 1,
          price: finalPrice
        }]
      };

      let paymentResponse;

      if (formData.paymentMethod === 'credit_card') {
        const [expiryMonth, expiryYear] = formData.cardExpiry?.split('/') || [];
        paymentResponse = await paymentService.processCreditCard({
          ...paymentData,
          cardData: {
            number: formData.cardNumber?.replace(/\s/g, '') || '',
            name: formData.cardName || '',
            expiryMonth,
            expiryYear,
            cvv: formData.cardCvv || '',
            cpf: formData.cpf.replace(/\D/g, '')
          }
        });
      } else if (formData.paymentMethod === 'boleto') {
        paymentResponse = await paymentService.generateBoleto(paymentData);
      } else {
        paymentResponse = await paymentService.generatePix(paymentData);
      }

      if (paymentResponse.status === 'approved' || paymentResponse.status === 'pending') {
        // Salvar dados do pagamento no localStorage para a página de confirmação
        localStorage.setItem('lastPayment', JSON.stringify({
          ...paymentResponse,
          customer: paymentData.customer,
          installments: formData.installments
        }));
        
        // Enviar emails para pagamentos aprovados imediatamente (cartão)
        if (paymentResponse.status === 'approved') {
          try {
            // Email de confirmação de pagamento
            await emailService.sendPaymentConfirmation(
              formData.email,
              formData.name,
              {
                amount: finalPrice,
                method: getPaymentMethodName(formData.paymentMethod),
                transactionId: paymentResponse.id,
                productName: 'Clube do Livro - Mulheres que Correm com os Lobos'
              }
            );
            
            // Email de boas-vindas
            await emailService.sendWelcomeEmail(formData.email, formData.name);
            
            // WhatsApp de boas-vindas e confirmação
            if (formData.phone) {
              try {
                await whatsappService.sendWelcomeMessage(formData.phone, formData.name);
                await whatsappService.sendPaymentConfirmation(
                  formData.phone,
                  formData.name,
                  finalPrice,
                  paymentResponse.id
                );
                await whatsappService.sendGroupInvite(formData.phone, 'main_group');
              } catch (whatsappError) {
                console.error('Erro ao enviar WhatsApp:', whatsappError);
                // Não bloquear por erro do WhatsApp
              }
            }
          } catch (error) {
            console.error('Erro ao enviar emails:', error);
            // Não bloquear o fluxo por erro de email
          }
        }
        
        navigate('/checkout/confirmacao');
      } else {
        setPaymentError(paymentResponse.errorMessage || 'Erro ao processar pagamento');
      }
    } catch (error: any) {
      setPaymentError(error.message || 'Erro ao processar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'form' && validateForm()) {
      setStep('payment');
    } else if (step === 'payment') {
      handlePayment();
    }
  };

  if (step === 'product') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-elegant font-light text-terracota text-center mb-4">
              Clube do Livro
            </h1>
            <h2 className="text-3xl lg:text-5xl font-elegant font-light text-dourado text-center mb-12">
              Mulheres que Correm com os Lobos
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{benefit.icon}</span>
                    <p className="text-gray-700 flex-1">{benefit.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <p className="text-gray-500 line-through text-2xl">De R$ {basePrice}</p>
                <p className="text-5xl font-bold text-terracota">Por R$ {discountedPrice}</p>
                <p className="text-gray-600 mt-2">ou em até 12x de R$ {(discountedPrice / 12).toFixed(2)}</p>
              </div>

              <button
                onClick={() => setStep('form')}
                className="bg-terracota text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-marrom-escuro transition-colors"
              >
                QUERO TRANSFORMAR MINHA VIDA
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-elegant font-light text-terracota text-center mb-8">
            {step === 'form' ? 'Dados Pessoais' : 'Pagamento'}
          </h1>

          {/* Progress Bar */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-terracota text-white flex items-center justify-center font-semibold">
                ✓
              </div>
              <div className="w-24 h-1 bg-terracota mx-2"></div>
              <div className={`w-10 h-10 rounded-full ${step === 'form' ? 'bg-terracota' : 'bg-gray-300'} text-white flex items-center justify-center font-semibold`}>
                2
              </div>
              <div className={`w-24 h-1 ${step === 'payment' ? 'bg-terracota' : 'bg-gray-300'} mx-2`}></div>
              <div className={`w-10 h-10 rounded-full ${step === 'payment' ? 'bg-terracota' : 'bg-gray-300'} text-white flex items-center justify-center font-semibold`}>
                3
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            {step === 'form' ? (
              <>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-terracota focus:border-transparent`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-terracota focus:border-transparent`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(00) 00000-0000"
                        className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-terracota focus:border-transparent`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                      <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        placeholder="000.000.000-00"
                        className={`w-full px-4 py-3 rounded-lg border ${errors.cpf ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-terracota focus:border-transparent`}
                      />
                      {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        Li e aceito os <a href="#" className="text-terracota underline">termos de uso</a> e a <a href="#" className="text-terracota underline">política de privacidade</a>
                      </span>
                    </label>
                    {errors.acceptTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>}
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('product')}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-terracota text-white py-3 rounded-lg font-semibold hover:bg-marrom-escuro transition-colors"
                  >
                    Continuar para Pagamento
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Payment Step */}
                <div className="space-y-6">
                  {paymentError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {paymentError}
                    </div>
                  )}

                  {/* Coupon */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cupom de desconto</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="couponCode"
                        value={formData.couponCode || ''}
                        onChange={handleInputChange}
                        placeholder="Digite seu cupom"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-terracota focus:border-transparent"
                        disabled={!!appliedCoupon}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isLoading || !!appliedCoupon}
                        className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-marrom-escuro transition-colors disabled:opacity-50"
                      >
                        {appliedCoupon ? 'Aplicado' : 'Aplicar'}
                      </button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-green-600 text-sm mt-2">
                        ✅ Cupom {appliedCoupon} aplicado com sucesso!
                      </p>
                    )}
                  </div>

                  {/* Price Summary */}
                  <div className="bg-rose-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-600 line-through">R$ {basePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Desconto especial</span>
                        <span className="text-green-600">- R$ {(basePrice - discountedPrice).toFixed(2)}</span>
                      </div>
                      {couponDiscount && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cupom {appliedCoupon}</span>
                          <span className="text-green-600">
                            - R$ {couponDiscount.type === 'percentage' 
                              ? (discountedPrice * couponDiscount.amount / 100).toFixed(2)
                              : couponDiscount.amount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span className="text-terracota">R$ {finalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Forma de pagamento</label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={formData.paymentMethod === 'credit_card'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <span className="font-medium">💳 Cartão de Crédito</span>
                          <p className="text-sm text-gray-600">Parcelamento em até 12x</p>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="pix"
                          checked={formData.paymentMethod === 'pix'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <span className="font-medium">📱 PIX</span>
                          <p className="text-sm text-gray-600">Aprovação instantânea</p>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="boleto"
                          checked={formData.paymentMethod === 'boleto'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <span className="font-medium">📄 Boleto Bancário</span>
                          <p className="text-sm text-gray-600">Vencimento em 3 dias úteis</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Credit Card Fields */}
                  {formData.paymentMethod === 'credit_card' && (
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número do cartão</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber || ''}
                          onChange={handleInputChange}
                          placeholder="0000 0000 0000 0000"
                          className={`w-full px-4 py-3 rounded-lg border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-terracota focus:border-transparent`}
                        />
                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome no cartão</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName || ''}
                          onChange={handleInputChange}
                          placeholder="MARIA SILVA"
                          className={`w-full px-4 py-3 rounded-lg border ${errors.cardName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-terracota focus:border-transparent`}
                        />
                        {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Validade</label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry || ''}
                            onChange={handleInputChange}
                            placeholder="MM/AA"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.cardExpiry ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-terracota focus:border-transparent`}
                          />
                          {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            name="cardCvv"
                            value={formData.cardCvv || ''}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength={4}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.cardCvv ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-terracota focus:border-transparent`}
                          />
                          {errors.cardCvv && <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parcelas</label>
                        <select
                          name="installments"
                          value={formData.installments}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-terracota focus:border-transparent"
                        >
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}x de R$ {(finalPrice / (i + 1)).toFixed(2)} {i === 0 ? 'sem juros' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    disabled={isLoading}
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-terracota text-white py-3 rounded-lg font-semibold hover:bg-marrom-escuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processando...' : 'Finalizar Compra'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;