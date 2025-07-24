import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-sm py-3 md:py-4 shadow-lg' 
          : 'bg-transparent py-4 md:py-8'
      }`}
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo no canto esquerdo */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center group"
            aria-label="Voltar ao topo"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-dourado/30 border-2 border-dourado-dark flex items-center justify-center group-hover:bg-dourado/40 transition-all duration-300">
              <span className="text-dourado-dark font-serif text-lg md:text-xl font-bold" aria-hidden="true">CL</span>
            </div>
          </button>

          {/* Botão central */}
          <button 
            onClick={() => {
              const enrollSection = document.getElementById('inscricao');
              if (enrollSection) {
                enrollSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className={`font-sans text-xs sm:text-sm font-semibold px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all duration-300 ${
              isScrolled
                ? 'bg-dourado-dark text-white hover:bg-dourado transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-dourado'
                : 'text-white border-2 border-dourado-dark hover:bg-dourado-dark hover:text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-dourado'
            }`}
            aria-label="Quero participar do Clube do Livro"
          >
            <span className="hidden sm:inline">Quero Participar</span>
            <span className="sm:hidden">Participar</span>
          </button>

          {/* Ícone de perfil no canto direito */}
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center group"
            aria-label="Fazer login ou acessar perfil"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-white">
              <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;