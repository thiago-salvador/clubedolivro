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
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Coluna Esquerda - Título */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-elegant font-light text-gray-900 leading-tight">
              Dúvidas<br />
              Frequentes
            </h2>
          </div>

          {/* Coluna Direita - Acordeão */}
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
            className="bg-[#B8860B] hover:bg-[#8B6914] text-white font-sans font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Fale Conosco no WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;