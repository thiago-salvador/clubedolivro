import React from 'react';

interface Product {
  id: number;
  name: string;
  brand: string;
  image: string;
  discount: string;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Kit Skincare Premium",
    brand: "Belle Naturelle",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    discount: "15% OFF",
    category: "Skincare"
  },
  {
    id: 2,
    name: "Sérum Facial Vitamina C",
    brand: "Glow Essence",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    discount: "20% OFF",
    category: "Skincare"
  },
  {
    id: 3,
    name: "Perfume Floral Exclusivo",
    brand: "Essence D'Or",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    discount: "25% OFF",
    category: "Perfumaria"
  },
  {
    id: 4,
    name: "Kit Maquiagem Profissional",
    brand: "MakeUp Pro",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    discount: "30% OFF",
    category: "Maquiagem"
  },
  {
    id: 5,
    name: "Óleo Essencial Relaxante",
    brand: "Zen Aroma",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    discount: "10% OFF",
    category: "Bem-estar"
  },
  {
    id: 6,
    name: "Creme Hidratante Corporal",
    brand: "Soft Touch",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    discount: "15% OFF",
    category: "Cuidados Corporais"
  }
];

const BenefitsAndPartners: React.FC = () => {
  return (
    <section className="relative w-full py-16 lg:py-24 px-6 lg:px-8" style={{ backgroundColor: '#F5F5DC' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-elegant font-light text-gray-900 mb-4">
            Benefícios e Parceiros
          </h2>
          <p className="text-lg font-sans text-gray-700 max-w-3xl mx-auto">
            Além do conhecimento transformador, nossas alunas têm acesso a descontos exclusivos 
            em produtos selecionados de beleza e bem-estar de nossos parceiros.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-[#B8860B] text-white px-3 py-1 rounded-full text-sm font-sans font-bold">
                  {product.discount}
                </div>
                {/* Category Tag */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-sans">
                  {product.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm font-sans text-gray-500 mb-1">{product.brand}</p>
                <h3 className="text-xl font-sans font-semibold text-gray-900 mb-3">
                  {product.name}
                </h3>
                <button className="w-full bg-white hover:bg-gray-100 text-black font-sans font-medium py-2 px-4 rounded-full transition-all duration-300 border-2 border-[#B8860B] hover:border-[#8B6914]">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-700 font-sans mb-6">
            Estes são apenas alguns dos benefícios exclusivos que nossas alunas recebem.
          </p>
          <button 
            onClick={() => window.location.href = '/checkout'}
            className="bg-[#B8860B] hover:bg-[#8B6914] text-white font-sans font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            QUERO TODOS OS BENEFÍCIOS
          </button>
        </div>
      </div>
    </section>
  );
};

export default BenefitsAndPartners;