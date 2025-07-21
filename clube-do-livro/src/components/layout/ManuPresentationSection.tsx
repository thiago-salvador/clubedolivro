import React from 'react';
import manuelaXavierImage from '../../assets/images/manuela-xavier.jpg';

const ManuPresentationSection: React.FC = () => {
  return (
    <section className="relative w-full py-16 lg:py-24 px-6 lg:px-8" style={{ backgroundColor: '#2C2C2C' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Coluna Esquerda - Visual com Sobreposição */}
          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
            {/* Imagem de Fundo */}
            <img 
              src={manuelaXavierImage}
              alt="Manuela Xavier"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Overlay escuro sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            
            {/* Bloco do Título com Sobreposição */}
            <div 
              className="absolute top-8 left-8 right-8 bg-[#2C2C2C] p-6 lg:p-8 rounded-lg shadow-2xl"
              style={{ backgroundColor: 'rgba(44, 44, 44, 0.95)' }}
            >
              <h3 className="text-xl lg:text-2xl font-elegant font-light text-[#F5F5DC] text-center leading-relaxed">
                quem é<br />
                <span className="text-2xl lg:text-3xl font-medium">MANUELA XAVIER?</span>
              </h3>
            </div>
          </div>

          {/* Coluna Direita - Texto Biográfico */}
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-elegant font-light text-[#F5F5DC] mb-6 leading-tight">
              Quem é Manuela Xavier?
            </h2>
            
            <p className="text-base lg:text-lg xl:text-xl font-sans text-[#F5F5DC]/80 leading-relaxed">
              Comunicadora e referência em narrativas femininas, Manuela Xavier é psicanalista e 
              doutora em Psicologia. Após uma carreira de 12 anos como professora universitária e 
              clínica, Manuela expandiu sua atuação para as redes sociais, onde promove diálogos 
              potentes sobre psicanálise, gênero e cultura.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManuPresentationSection;