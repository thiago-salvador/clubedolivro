import React from 'react';
import manuelaXavierImage from '../../assets/images/manuela-xavier.jpg';

const AboutManuSection: React.FC = () => {
  return (
    <section className="relative w-full py-16 lg:py-24 px-6 lg:px-8" style={{ backgroundColor: '#2C2C2C' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Coluna Esquerda - Conteúdo de Texto */}
          <div className="relative z-10 mb-8 lg:mb-0">
            <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-elegant font-light text-[#F5F5DC] mb-6 leading-tight">
              Mais sobre a Manu
            </h2>
            
            <p className="text-base lg:text-lg xl:text-xl font-sans text-[#F5F5DC] leading-relaxed">
              Manuela Xavier é psicanalista, doutora em psicologia clínica, comunicadora e feminista. 
              Reconhecida pelo trabalho nas redes sociais, dedica-se a empoderar mulheres por meio de 
              conteúdos sobre autoconhecimento, autoestima e enfrentamento da violência psicológica. 
              Após superar um relacionamento abusivo, Manuela criou espaços e projetos de acolhimento 
              e formação, inspirando mulheres a assumirem o protagonismo de suas histórias e escolhas.
            </p>
          </div>

          {/* Coluna Direita - Imagem */}
          <div className="relative order-first lg:order-last">
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 max-w-md mx-auto lg:max-w-none">
                <img 
                  src={manuelaXavierImage}
                  alt="Manuela Xavier segurando o livro 'De Olhos Abertos'" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutManuSection;