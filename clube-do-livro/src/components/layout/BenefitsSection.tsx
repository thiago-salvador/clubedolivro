import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoonIcon, VideoIcon, PenIcon, MusicIcon, ChatIcon, CommunityIcon, GiftIcon } from './BenefitIcons';
import { X, Plus, Minus } from 'lucide-react';

interface Benefit {
  id: number;
  icon: React.ReactNode;
  title: string;
  shortText: string;
  fullDescription: string;
}

const BenefitsSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (benefit: Benefit) => {
    setSelectedBenefit(benefit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBenefit(null), 300);
  };

  const handleScrollToEnroll = () => {
    const enrollSection = document.getElementById('inscricao');
    if (enrollSection) {
      enrollSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const benefits: Benefit[] = [
    {
      id: 1,
      icon: <MoonIcon className="w-10 h-10 text-dourado" />,
      title: '4 meses e meio juntas',
      shortText: '17 semanas de um mergulho profundo em si mesma',
      fullDescription: 'Durante 17 semanas transformadoras, você será guiada em um mergulho profundo em si mesma, explorando cada aspecto da sua natureza feminina selvagem através da sabedoria ancestral contida no livro.'
    },
    {
      id: 2,
      icon: <VideoIcon className="w-10 h-10 text-dourado" />,
      title: 'Vídeo aulas exclusivas',
      shortText: '17 vídeo aulas com análise de cada capítulo do livro',
      fullDescription: 'Acesse 17 vídeo aulas exclusivas onde Manu Xavier analisa profundamente cada capítulo, trazendo insights terapêuticos e conexões práticas com a vida moderna.'
    },
    {
      id: 3,
      icon: <PenIcon className="w-10 h-10 text-dourado" />,
      title: 'Exercícios terapêuticos',
      shortText: '17 exercícios terapêuticos para aprofundar o que foi lido',
      fullDescription: 'Pratique 17 exercícios terapêuticos cuidadosamente elaborados para aprofundar sua compreensão e integrar os ensinamentos de cada capítulo em sua vida diária.'
    },
    {
      id: 4,
      icon: <MusicIcon className="w-10 h-10 text-dourado" />,
      title: 'Mais do que uma playlist',
      shortText: '17 músicas analisadas para embalar e provocar cada etapa da leitura',
      fullDescription: 'Mergulhe ainda mais fundo com 17 músicas especialmente selecionadas para embalar e provocar reflexões em cada etapa da sua jornada de leitura.'
    },
    {
      id: 5,
      icon: <ChatIcon className="w-10 h-10 text-dourado" />,
      title: 'Roda de conversa',
      shortText: '17 encontros online e interativos para troca de experiências',
      fullDescription: 'Participe de 17 encontros online ao vivo, onde você poderá interagir diretamente com Manu Xavier e outras participantes, compartilhando experiências e insights.'
    },
    {
      id: 6,
      icon: <CommunityIcon className="w-10 h-10 text-dourado" />,
      title: 'Comunidade exclusiva',
      shortText: 'um espaço fechado para conexões, trocas genuínas e conteúdos exclusivos',
      fullDescription: 'Faça parte de uma comunidade fechada e acolhedora, onde você encontrará conexões autênticas, conteúdos exclusivos e um espaço seguro para trocas genuínas.'
    },
    {
      id: 7,
      icon: <GiftIcon className="w-10 h-10 text-dourado" />,
      title: 'Benefícios clubers',
      shortText: 'uma área com descontos exclusivos em produtos das marcas parceiras',
      fullDescription: 'Aproveite uma área especial com descontos exclusivos de marcas parceiras alinhadas com os valores do clube, pensadas especialmente para seu bem-estar.'
    }
  ];

  return (
    <section id="benefits" className="benefits-section relative w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=1080&fit=crop&q=80')`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h2 className="text-4xl lg:text-6xl font-elegant font-light text-dourado text-center mb-16">
            O QUE TE ESPERA
          </h2>

          {/* Benefits Grid - Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {benefits.slice(0, 6).map((benefit) => (
              <div 
                key={benefit.id}
                onClick={() => handleCardClick(benefit)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-dourado/50 hover:shadow-2xl relative"
              >
                {/* Plus icon in top right corner */}
                <div className="absolute top-4 right-4">
                  <Plus className="w-5 h-5 text-dourado/60" />
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-dourado/20 rounded-full">
                    {benefit.icon}
                  </div>
                  <h3 className="font-sans font-semibold text-white text-lg">
                    {benefit.title}
                  </h3>
                  <p className="text-white/80 font-sans text-sm">
                    {benefit.shortText}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 7th card centered */}
          <div className="flex justify-center mb-16">
            <div 
              onClick={() => handleCardClick(benefits[6])}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-dourado/50 hover:shadow-2xl relative max-w-sm w-full"
            >
              {/* Plus icon in top right corner */}
              <div className="absolute top-4 right-4">
                <Plus className="w-5 h-5 text-dourado/60" />
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-dourado/20 rounded-full">
                  {benefits[6].icon}
                </div>
                <h3 className="font-sans font-semibold text-white text-lg">
                  {benefits[6].title}
                </h3>
                <p className="text-white/80 font-sans text-sm">
                  {benefits[6].shortText}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button 
              onClick={handleScrollToEnroll}
              className="bg-white hover:bg-gray-100 text-black font-sans font-medium text-sm tracking-wider px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl uppercase"
            >
              Quero Participar
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedBenefit && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-lg w-full transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-dourado/20 rounded-full">
                  {selectedBenefit.icon}
                </div>
                <h3 className="text-2xl font-elegant font-semibold text-gray-900">
                  {selectedBenefit.title}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <p className="text-gray-700 font-sans text-base leading-relaxed mb-6">
              {selectedBenefit.fullDescription}
            </p>
            <button
              onClick={handleScrollToEnroll}
              className="w-full bg-dourado hover:bg-amber-600 text-white font-sans font-medium text-sm tracking-wider px-6 py-3 rounded-full transition-all duration-300"
            >
              QUERO FAZER PARTE
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default BenefitsSection;