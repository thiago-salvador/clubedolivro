import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Quando serão os encontros ao vivo?",
    answer: "Os encontros ao vivo acontecem semanalmente, sempre às quartas-feiras às 20h (horário de Brasília). As datas específicas são divulgadas no início de cada turma e você receberá lembretes por e-mail e WhatsApp."
  },
  {
    id: 2,
    question: "Os encontros ficam gravados?",
    answer: "Sim! Todos os encontros ao vivo são gravados e ficam disponíveis na plataforma por tempo indeterminado. Você pode assistir quando quiser, quantas vezes desejar, no seu próprio ritmo."
  },
  {
    id: 3,
    question: "O livro está incluso na compra?",
    answer: "No plano 'Clube Completo', você recebe um box com 12 livros selecionados especialmente pela Manuela Xavier. No plano 'Clube sem Livros', você tem acesso a todo conteúdo digital, mas precisa adquirir os livros por conta própria."
  },
  {
    id: 4,
    question: "Estou com problema no acesso, o que fazer?",
    answer: "Se você está com dificuldades para acessar a plataforma, entre em contato conosco pelo WhatsApp ou envie um e-mail para suporte@clubedolivro.com.br. Nossa equipe responde em até 24 horas úteis."
  },
  {
    id: 5,
    question: "Ainda estou com dúvidas",
    answer: "Sem problemas! Você pode entrar em contato conosco pelo WhatsApp clicando no botão de contato no site, ou enviar suas dúvidas para contato@clubedolivro.com.br. Teremos prazer em esclarecer todas as suas questões."
  }
];

const FAQSection: React.FC = () => {
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  const toggleItem = (itemId: number) => {
    setOpenItemId(openItemId === itemId ? null : itemId);
  };

  return (
    <section className="relative w-full py-16 lg:py-24 px-6 lg:px-8" style={{ backgroundColor: '#F5F5DC' }}>
      <div className="max-w-3xl mx-auto">
        {/* Título Centralizado */}
        <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-elegant font-light text-gray-900 text-center mb-12">
          Dúvidas Frequentes
        </h2>
        
        {/* Acordeão Centralizado */}
        <div className="space-y-4">
            {faqData.map((item) => (
              <div 
                key={item.id}
                className="border-b border-gray-300 pb-4 last:border-0"
              >
                {/* Pergunta */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between py-4 text-left transition-all duration-300 hover:opacity-80 group"
                >
                  <h3 className="text-lg lg:text-xl font-sans font-medium text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  <span className="flex-shrink-0 text-gray-900 text-2xl font-light transition-transform duration-300">
                    {openItemId === item.id ? '−' : '+'}
                  </span>
                </button>

                {/* Resposta */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openItemId === item.id ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-700 font-sans text-base lg:text-lg leading-relaxed pb-4">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* CTA Final */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 font-sans text-base mb-6">
            Não encontrou o que procurava?
          </p>
          <button 
            onClick={() => {
              const phoneNumber = '5511999999999'; // Substituir pelo número real
              const message = 'Olá! Tenho uma dúvida sobre o Clube do Livro.';
              window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
            }}
            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-sans font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Fale Conosco no WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;