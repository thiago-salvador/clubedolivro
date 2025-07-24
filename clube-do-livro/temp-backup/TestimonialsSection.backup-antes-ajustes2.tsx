import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  image: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Marina Oliveira",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    text: "O clube me ajudou a reconhecer padrões tóxicos que eu nem percebia. Hoje me sinto mais forte e consciente das minhas escolhas. É libertador!"
  },
  {
    id: 2,
    name: "Beatriz Santos",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    text: "Encontrei aqui um espaço seguro para compartilhar e aprender. As aulas da Manu são transformadoras e a comunidade é acolhedora demais."
  },
  {
    id: 3,
    name: "Carolina Ferreira",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    text: "Participar do clube foi um divisor de águas na minha vida. Aprendi a estabelecer limites saudáveis e hoje tenho relacionamentos muito mais equilibrados."
  },
  {
    id: 4,
    name: "Ana Paula Costa",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    text: "A leitura guiada pela Manu transformou completamente minha visão sobre mim mesma. É como se eu tivesse despertado para minha própria vida."
  },
  {
    id: 5,
    name: "Juliana Mendes",
    image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    text: "O clube foi essencial para meu processo de cura. As trocas na comunidade e os exercícios terapêuticos me ajudaram a ressignificar traumas antigos."
  }
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const slideRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Configuração responsiva
  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      setSlidesToShow(width >= 1024 ? 3 : width >= 768 ? 2 : 1);
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - slidesToShow);

  // Auto-play do carrossel
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
      }, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, maxIndex]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section 
      className="relative w-full py-16 lg:py-24 px-6 lg:px-8" 
      style={{ backgroundColor: '#2C2C2C' }}
      aria-label="Depoimentos de alunas"
    >
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-elegant font-light text-[#F5F5DC] text-center mb-12 lg:mb-16">
          Quem já passou por aqui
        </h2>

        {/* Container do Carrossel */}
        <div className="relative">
          {/* Botão Anterior */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
            aria-label="Depoimento anterior"
          >
            <ChevronLeft className="w-6 h-6 text-[#F5F5DC]" />
          </button>

          {/* Botão Próximo */}
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
            aria-label="Próximo depoimento"
          >
            <ChevronRight className="w-6 h-6 text-[#F5F5DC]" />
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden mx-auto">
            <div
              ref={slideRef}
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={`w-full md:w-1/2 lg:w-1/3 px-4 flex-shrink-0`}
                >
                  <div className="group h-full">
                    <div className="bg-[#2C2C2C] rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.03] h-full flex flex-col" style={{
                      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
                    }}>
                      {/* Imagem */}
                      <div className="relative overflow-hidden aspect-square">
                        <img
                          src={testimonial.image}
                          alt={`Depoimento de ${testimonial.name}`}
                          className="w-full h-full object-cover filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Conteúdo */}
                      <div className="p-6 space-y-4 flex-grow flex flex-col">
                        <p className="text-[#F5F5DC] font-sans text-base lg:text-lg italic leading-relaxed flex-grow">
                          "{testimonial.text}"
                        </p>
                        <p className="text-[#F5F5DC]/80 font-sans text-sm">
                          — {testimonial.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores de Navegação */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {[...Array(maxIndex + 1)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-[#B8860B]'
                    : 'w-2 bg-[#F5F5DC]/30 hover:bg-[#F5F5DC]/50'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Indicador de mais depoimentos */}
        <div className="mt-12 text-center">
          <p className="text-[#F5F5DC]/60 font-sans text-sm">
            + Centenas de mulheres transformadas
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;