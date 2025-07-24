import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
          ? 'bg-black/90 backdrop-blur-sm py-3 md:py-4 shadow-lg' 
          : 'bg-transparent py-4 md:py-8'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
          <div className="flex items-center space-x-4 sm:space-x-8 lg:space-x-12">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white font-sans text-xs sm:text-sm font-medium hover:text-dourado transition-colors"
            >
              INÍCIO
            </button>
            <button 
              onClick={() => navigate('/checkout')}
              className={`font-sans text-xs sm:text-sm font-semibold px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all duration-300 ${
                isScrolled
                  ? 'bg-dourado text-black hover:bg-amber-500'
                  : 'text-dourado border border-dourado hover:bg-dourado hover:text-black'
              }`}
            >
              <span className="hidden sm:inline">Quero Participar</span>
              <span className="sm:hidden">Participar</span>
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="text-white font-sans text-xs sm:text-sm font-medium hover:text-dourado transition-colors"
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;