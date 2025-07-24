import React from 'react';

const AboutManuSection: React.FC = () => {
  return (
    <section className="relative w-full py-16 lg:py-24 px-6 lg:px-8" style={{ backgroundColor: '#2C2C2C' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center">
          {/* Coluna Esquerda - Conteúdo de Texto */}
          <div className="relative z-10 max-w-4xl w-full">
            <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-elegant font-light text-white mb-6 leading-tight">
              Por que ler esse livro junto com outras mulheres?
            </h2>
            
            <div className="space-y-4">
              <p className="text-base lg:text-lg xl:text-xl font-sans text-[#F5F5DC] leading-relaxed">
                Best-seller da Amazon em "Estudos sobre a Mulher", Mulheres que Correm com os Lobos é mais que leitura: é um portal para sua força instintiva, criatividade e potência, transformando dores em sabedoria e trazendo mais prazer, verdade e consciência.
              </p>
              
              <p className="text-base lg:text-lg xl:text-xl font-sans text-[#F5F5DC] leading-relaxed">
                Agora, pela última vez, essa jornada acontece de forma dinâmica, terapêutica e guiada por Manu Xavier, psicanalista que já conduziu mais de 10 mil mulheres nessa experiência transformadora.
              </p>
              
              <p className="text-base lg:text-lg xl:text-xl font-sans text-[#F5F5DC] leading-relaxed">
                Se você se sente sozinha, incompreendida ou já tentou ler o livro sem conseguir, esse clube é pra você. Aqui você vai entender o que o livro revela sobre você, dar nome ao que não sabia nomear, reconhecer e quebrar padrões que te sabotam.
              </p>
              
              <p className="text-base lg:text-lg xl:text-xl font-sans text-[#F5F5DC] leading-relaxed">
                Mais que um caminho, é um mapa – compartilhado com outras mulheres prontas para caminhar ao seu lado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutManuSection;