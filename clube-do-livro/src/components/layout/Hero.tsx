import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroBackground from '../../assets/images/hero-bg-new.png';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBackground} 
          alt="Mulheres que Correm com os Lobos - Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 flex justify-center pt-8">
        <div className="flex items-center space-x-12">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-white font-sans text-sm font-medium hover:text-dourado transition-colors"
          >
            INÍCIO
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="text-white font-sans text-sm font-medium hover:text-dourado transition-colors"
          >
            LOGIN
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-32">
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
            onClick={() => navigate('/checkout')}
            className="bg-white hover:bg-gray-100 text-black font-sans font-semibold text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            QUERO PARTICIPAR
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-24">
        <div className="px-8 lg:px-16 pb-12">
          <p className="text-white/60 text-center font-sans text-sm lg:text-base font-light tracking-widest">
            TRANSFORME SUA VIDA · PÁGINA POR PÁGINA · SESSÃO POR SESSÃO
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;