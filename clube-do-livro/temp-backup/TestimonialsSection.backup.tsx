import React from 'react';

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
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="relative w-full py-16 lg:py-24 px-6 lg:px-8" style={{ backgroundColor: '#2C2C2C' }}>
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-elegant font-light text-[#F5F5DC] text-center mb-12 lg:mb-16">
          Quem já passou por aqui
        </h2>

        {/* Grid de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="group">
              <div className="bg-[#2C2C2C] rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
                {/* Imagem */}
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={testimonial.image}
                    alt={`Depoimento de ${testimonial.name}`}
                    className="w-full h-full object-cover filter grayscale-[30%] hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Conteúdo */}
                <div className="p-6 space-y-4">
                  <p className="text-[#F5F5DC] font-sans text-base lg:text-lg italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <p className="text-[#F5F5DC]/80 font-sans text-sm">
                    — {testimonial.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
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