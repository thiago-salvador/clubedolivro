import React from 'react';
import manuelaImage from '../../assets/images/manuela-xavier-about.jpg';

const QuemEManuelaSection: React.FC = () => {
  return (
    <section className="relative w-full py-16 lg:py-24 px-6 lg:px-8" style={{ backgroundColor: '#2C2C2C' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Coluna Esquerda - Imagem */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-xl max-w-md mx-auto lg:max-w-none">
              <img 
                src={manuelaImage}
                alt="Manuela Xavier"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Coluna Direita - Conteúdo de Texto */}
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-elegant font-light text-[#F5F5DC] mb-6 leading-tight">
              Quem É Manuela Xavier
            </h2>
            
            <div className="space-y-4">
              <p className="text-base lg:text-lg font-sans text-[#F5F5DC] leading-relaxed">
                Comunicadora e referência em narrativas femininas, Manuela Xavier também é psicanalista e doutora em psicologia. Formada em Psicologia pela UFF, mestre e doutora em Psicologia Clínica pela PUC-RJ, Manu atendeu como psicanalista na clínica por 12 anos ouvindo e acolhendo mulheres.
              </p>
              
              <p className="text-base lg:text-lg font-sans text-[#F5F5DC] leading-relaxed">
                Foi professora em universidades como UFF e Estácio de Sá e, movida pela necessidade de se comunicar com mais pessoas, expandiu sua comunicação para as redes sociais, dialogando sobre psicanálise, gênero e cultura. Hoje é colunista da revista Glamour e está também a frente de um podcast de sucesso em que traz reflexões recém saídas da terapia, o podcast No Espelho, que estampa os rankings do Spotify desde a sua estreia.
              </p>
              
              <p className="text-base lg:text-lg font-sans text-[#F5F5DC] leading-relaxed">
                Nas suas redes sociais, que somam mais de 400 mil seguidores, Manu traz conteúdos relevantes sobre protagonismo feminino. Capricorniana e apaixonada por literatura, está desde 2020 conduzindo leituras dirigidas a partir de uma perspectiva psicanalítica, com uma abordagem terapêutica, por onde já passaram mais de 10 mil participantes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuemEManuelaSection;