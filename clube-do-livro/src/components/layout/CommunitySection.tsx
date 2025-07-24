import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import alunaAreaPreview from '../../assets/images/aluna-area-preview.png';

const CommunitySection: React.FC = () => {
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleScrollToEnroll = () => {
    const enrollSection = document.getElementById('inscricao');
    if (enrollSection) {
      enrollSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <section className="relative w-full py-16 lg:py-24 px-6 lg:px-8" style={{ backgroundColor: '#F5F5DC' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Coluna Esquerda - Conteúdo de Texto */}
          <div className="relative z-10 mb-8 lg:mb-0">
            <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-elegant font-light text-gray-900 mb-6 leading-tight">
              Mais que um clube,{' '}
              <span className="font-bold bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] bg-clip-text text-transparent">
                UMA COMUNIDADE!
              </span>
            </h2>
            
            <p className="text-base lg:text-lg xl:text-xl font-sans text-gray-700 leading-relaxed mb-8">
              Onde a gente encontra outras mulheres iguais a gente, ninguém está sozinha! E num espaço seguro a gente compartilha não só nossas experiências na leitura, mas nossas vivências, medos e desejos, num espaço livre de julgamentos e cheio de acolhimento!
            </p>
            
            <button 
              onClick={handleScrollToEnroll}
              className="bg-white hover:bg-gray-100 text-black font-sans font-semibold text-base px-8 lg:px-10 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-[#B8860B] hover:border-[#8B6914] w-full sm:w-auto"
            >
              QUERO FAZER PARTE
            </button>
          </div>

          {/* Coluna Direita - Mockup com sobreposição */}
          <div className="relative order-first lg:order-last lg:-ml-12">
            <div className="relative">
              <div 
                className="relative overflow-hidden rounded-xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 max-w-md mx-auto lg:max-w-none cursor-pointer" 
                style={{
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3), 0 10px 20px -10px rgba(0, 0, 0, 0.2)'
                }}
                onClick={openVideoModal}
              >
                <img 
                  src={alunaAreaPreview} 
                  alt="Preview da área exclusiva das alunas" 
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay escuro com play button */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group hover:bg-black/50 transition-colors">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                    </div>
                    <p className="text-white font-sans text-sm font-medium">
                      Veja a comunidade por dentro
                    </p>
                  </div>
                </div>
                
                {/* Badge no canto superior direito */}
                <div className="absolute top-3 right-3 bg-[#B8860B] text-white px-3 py-1 rounded-full text-sm font-sans font-medium">
                  ÁREA EXCLUSIVA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={closeVideoModal}
        >
          <div 
            className="bg-black rounded-xl max-w-4xl w-full aspect-video relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <span className="text-sm">Fechar</span>
            </button>
            
            {/* Placeholder para vídeo - substituir por iframe do vídeo real */}
            <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
              <p className="text-white/60 text-lg">Vídeo de demonstração da comunidade</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CommunitySection;