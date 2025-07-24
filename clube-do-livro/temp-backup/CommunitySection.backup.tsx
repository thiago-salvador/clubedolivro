import React from 'react';
import { useNavigate } from 'react-router-dom';
import alunaAreaPreview from '../../assets/images/aluna-area-preview.png';

const CommunitySection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full py-16 lg:py-24 px-6 lg:px-8" style={{ backgroundColor: '#F5F5DC' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Coluna Esquerda - Conteúdo de Texto */}
          <div className="relative z-10 mb-8 lg:mb-0">
            <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-elegant font-light text-gray-900 mb-6 leading-tight">
              Mais que um clube,{' '}
              <span className="text-[#B8860B] font-medium">
                UMA COMUNIDADE!
              </span>
            </h2>
            
            <p className="text-base lg:text-lg xl:text-xl font-sans text-gray-700 leading-relaxed mb-8">
              Aqui você encontra um espaço seguro para trocas, aprendizados e conexões genuínas. 
              Uma jornada compartilhada de autoconhecimento e crescimento pessoal.
            </p>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="bg-white hover:bg-gray-100 text-black font-sans font-semibold text-base px-8 lg:px-10 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-[#B8860B] hover:border-[#8B6914] w-full sm:w-auto"
            >
              QUERO FAZER PARTE
            </button>
          </div>

          {/* Coluna Direita - Imagem */}
          <div className="relative order-first lg:order-last">
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300 max-w-md mx-auto lg:max-w-none">
                <img 
                  src={alunaAreaPreview} 
                  alt="Preview da área exclusiva das alunas" 
                  className="w-full h-auto object-cover"
                />
                
                {/* Badge no canto superior direito */}
                <div className="absolute top-3 right-3 bg-[#B8860B] text-white px-3 py-1 rounded-full text-sm font-sans font-medium">
                  ÁREA EXCLUSIVA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;