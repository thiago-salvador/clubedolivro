import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroBackground from '../../assets/images/hero-bg-new.png';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleScrollToEnroll = () => {
    const enrollSection = document.getElementById('inscricao');
    if (enrollSection) {
      enrollSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={heroBackground} 
          alt="Mulheres que Correm com os Lobos - Background" 
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 pt-40 pb-32">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm lg:text-base font-sans text-white/70 mb-8 tracking-wider font-light">CLUBE DO LIVRO</p>
          <div className="whitespace-nowrap">
            <h1 className="text-4xl lg:text-7xl font-elegant font-light text-white mb-3 leading-relaxed">
              MULHERES QUE CORREM
            </h1>
            <h1 className="text-4xl lg:text-7xl font-elegant font-light text-dourado mb-12 leading-relaxed">
              COM OS LOBOS
            </h1>
          </div>
          
          <button 
            onClick={handleScrollToEnroll}
            className="bg-white hover:bg-gray-100 text-black font-sans font-semibold text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse-glow"
          >
            QUERO PARTICIPAR
          </button>

        </div>
      </div>

      {/* Footer with Logo Strip */}
      <div className="relative mt-24">
        <div className="px-8 lg:px-16 pb-12">
          <p className="text-white/60 text-center font-sans text-sm lg:text-base font-light tracking-widest">
            TRANSFORME SUA VIDA · PÁGINA POR PÁGINA · SESSÃO POR SESSÃO
          </p>
          
          {/* Logo Strip - positioned at bottom right - hidden on small mobile */}
          <div className="hidden sm:block absolute bottom-8 right-8 lg:right-16">
            <div className="flex items-center space-x-3">
              {/* Small circular logos */}
              {[1, 2, 3].map((index) => (
                <div 
                  key={index}
                  className="group cursor-pointer"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 border border-white/20 group-hover:border-white/40">
                    <span className="text-white/40 font-sans text-[10px] lg:text-xs group-hover:text-white/60 transition-colors duration-300">
                      {index}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;