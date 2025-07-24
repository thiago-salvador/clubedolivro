import React, { useState } from 'react';

// Icon Components
const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const MessageCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

type SelectedPlan = 'complete' | 'no-books' | null;
type PaymentMethod = 'credit' | 'pix';

const EnrollSection: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    installments: '12'
  });

  const benefits = [
    '17 semanas de mergulho profundo',
    '17 vídeo aulas exclusivas',
    'Grupo no WhatsApp com a Manu',
    'Comunidade exclusiva de alunas',
    'Exercícios terapêuticos práticos',
    'Encontros participativos online',
    'Materiais complementares',
    'Acesso vitalício ao conteúdo',
    'Certificado de participação',
    'Bônus surpresa ao longo do curso'
  ];

  const handlePlanSelect = (plan: 'complete' | 'no-books') => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})\d+?$/, '$1');
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2}\/\d{2})\d+?$/, '$1');
  };

  const handleFormattedInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case 'cpf':
        formattedValue = formatCPF(value);
        break;
      case 'phone':
        formattedValue = formatPhone(value);
        break;
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        break;
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const openWhatsApp = () => {
    const phoneNumber = '5511999999999'; // Substituir pelo número real
    const message = 'Olá! Tenho uma dúvida sobre o Clube do Livro.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="inscricao" className="relative w-full py-16 lg:py-24 px-6 lg:px-8" style={{ backgroundColor: '#F5F5DC' }}>
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-elegant font-light text-gray-900 text-center mb-12">
          Inscreva-se no Clube
        </h2>

        {/* Oferta Única Centralizada */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-[#B8860B] relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#B8860B] text-white px-6 py-1 rounded-full text-sm font-sans font-medium animate-pulse">
              OFERTA ESPECIAL
            </div>
            
            <h3 className="text-3xl font-elegant font-semibold text-gray-900 mb-8 text-center">
              Clube do Livro - Jornada Completa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Coluna Esquerda */}
              <div className="space-y-3">
                <h4 className="font-sans font-semibold text-gray-800 mb-3">Incluso no seu acesso:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-[#B8860B] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-sans text-sm">17 semanas de leitura</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-[#B8860B] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-sans text-sm">17 vídeo aula com análises de cada capítulo</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-[#B8860B] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-sans text-sm">17 exercícios terapêuticos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-[#B8860B] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-sans text-sm">17 músicas pra provocar cada etapa da leitura</span>
                  </li>
                </ul>
              </div>
              
              {/* Coluna Direita */}
              <div className="space-y-3">
                <h4 className="font-sans font-semibold text-gray-800 mb-3 md:mt-0 mt-4">Benefícios exclusivos:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-[#B8860B] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-sans text-sm">17 encontros online interativos e ao vivo</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-[#B8860B] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-sans text-sm">Comunidade exclusiva de alunas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-[#B8860B] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-sans text-sm">Área com descontos de marcas parceiras</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-[#B8860B] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-sans text-sm">2 anos de acesso ao conteúdo</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-[#B8860B] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-sans text-sm">Certificado de conclusão</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-sans mb-2">Investimento</p>
                <p className="text-4xl font-bold text-gray-900 font-sans mb-2">
                  12x R$65,05
                </p>
                <p className="text-base text-gray-500 font-sans">ou R$629,00 à vista</p>
              </div>
            </div>
            
            <button
              onClick={() => handlePlanSelect('complete')}
              className="w-full bg-[#B8860B] hover:bg-[#8B6914] text-white font-sans font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl text-lg flex items-center justify-center"
            >
              Garanta sua vaga
              <ChevronDown className={`ml-2 w-5 h-5 transition-transform ${showCheckout && selectedPlan === 'complete' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Área de Checkout Expansível com Efeito Acordeão */}
        <div className={`mx-auto max-w-2xl overflow-hidden transition-all duration-500 ease-in-out ${
          showCheckout && selectedPlan ? 'max-h-[2000px] opacity-100 mt-8' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200 transform transition-transform duration-300"
               style={{
                 boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.2)'
               }}>
            <h3 className="text-2xl font-sans font-bold text-gray-900 mb-6">
              Finalizar compra - {selectedPlan === 'complete' ? 'Clube Completo' : 'Clube sem Livros'}
            </h3>

            {/* Tabs de Pagamento */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setPaymentMethod('credit')}
                className={`pb-3 px-4 font-sans font-medium transition-colors ${
                  paymentMethod === 'credit'
                    ? 'text-[#B8860B] border-b-2 border-[#B8860B]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cartão de Crédito
              </button>
              <button
                onClick={() => setPaymentMethod('pix')}
                className={`pb-3 px-4 font-sans font-medium transition-colors ${
                  paymentMethod === 'pix'
                    ? 'text-[#B8860B] border-b-2 border-[#B8860B]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pix
              </button>
            </div>

            {/* Formulário */}
            <form className="space-y-6">
              {/* Dados Pessoais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    CPF
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleFormattedInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent font-sans"
                    maxLength={14}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormattedInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent font-sans"
                    maxLength={15}
                    required
                  />
                </div>
              </div>

              {/* Dados de Pagamento - Cartão */}
              {paymentMethod === 'credit' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                        Número do cartão
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleFormattedInput}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent font-sans"
                        maxLength={19}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                        Nome no cartão
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent font-sans"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                        Validade
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleFormattedInput}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent font-sans"
                        placeholder="MM/AA"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent font-sans"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                      Parcelas
                    </label>
                    <select
                      name="installments"
                      value={formData.installments}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent font-sans"
                    >
                      <option value="1">
                        À vista - R${selectedPlan === 'complete' ? '629,00' : '598,80'}
                      </option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 2} value={i + 2}>
                          {i + 2}x de R$
                          {selectedPlan === 'complete' 
                            ? (629.00 / (i + 2)).toFixed(2)
                            : (598.80 / (i + 2)).toFixed(2)
                          }
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Pix */}
              {paymentMethod === 'pix' && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-lg font-sans text-gray-700 mb-4">
                    Ao clicar em "Finalizar compra", você será direcionado para a tela de pagamento via Pix.
                  </p>
                  <p className="text-sm font-sans text-gray-600">
                    Valor: R${selectedPlan === 'complete' ? '629,00' : '598,80'} à vista
                  </p>
                </div>
              )}

              {/* Botão de Submit */}
              <button
                type="submit"
                className="w-full bg-[#B8860B] hover:bg-[#8B6914] text-white font-sans font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl text-lg"
              >
                Finalizar compra
              </button>

              {/* Sinais de Confiança */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-8 opacity-60" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 opacity-60" />
                <img src="https://logodownload.org/wp-content/uploads/2020/02/pix-bc-logo.png" alt="Pix" className="h-8 opacity-60" />
              </div>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                🔒 Pagamento 100% seguro
              </p>
            </form>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="text-center mt-12">
          <button
            onClick={openWhatsApp}
            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-sans font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Ficou com alguma dúvida? Fale conosco no WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default EnrollSection;