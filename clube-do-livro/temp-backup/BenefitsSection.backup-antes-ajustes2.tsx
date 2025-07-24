import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoonIcon, VideoIcon, PenIcon, MusicIcon, ChatIcon, CommunityIcon, GiftIcon } from './BenefitIcons';

interface Benefit {
  icon: React.ReactNode;
  text: string;
}

const BenefitsSection: React.FC = () => {
  const navigate = useNavigate();
  const benefits: Benefit[] = [
    {
      icon: <MoonIcon className="w-8 h-8 text-dourado" />,
      text: '17 semanas de um mergulho profundo em si mesma'
    },
    {
      icon: <VideoIcon className="w-8 h-8 text-dourado" />,
      text: '17 vídeo aula com análises de cada capítulo'
    },
    {
      icon: <PenIcon className="w-8 h-8 text-dourado" />,
      text: '17 exercícios terapêuticos pra aprofundar o que foi lido'
    },
    {
      icon: <MusicIcon className="w-8 h-8 text-dourado" />,
      text: '17 músicas pra embalar e provocar cada etapa da leitura'
    },
    {
      icon: <ChatIcon className="w-8 h-8 text-dourado" />,
      text: '17 encontros online interativos e ao vivo'
    },
    {
      icon: <CommunityIcon className="w-8 h-8 text-dourado" />,
      text: 'Uma comunidade fechada para conexões, conteúdos exclusivos e trocas genuínas'
    },
    {
      icon: <GiftIcon className="w-8 h-8 text-dourado" />,
      text: 'Uma área com descontos exclusivos pra participantes de marcas parceiras'
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

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 group hover:transform hover:translate-x-2 transition-all duration-300"
              >
                <span className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </span>
                <p className="text-white/90 font-elegant text-lg lg:text-xl leading-relaxed">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/checkout')}
              className="bg-white hover:bg-gray-100 text-black font-sans font-medium text-sm tracking-wider px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl uppercase"
            >
              Quero Participar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;