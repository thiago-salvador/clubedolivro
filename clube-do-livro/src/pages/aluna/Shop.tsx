import React, { useState } from 'react';

interface Partner {
  id: string;
  name: string;
  logo: string;
}

interface Product {
  id: string;
  partnerId: string;
  name: string;
  image: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  link: string;
}

const Shop: React.FC = () => {
  const [selectedPartner, setSelectedPartner] = useState<string>('all');

  const partners: Partner[] = [
    { id: 'all', name: 'Todos', logo: '🌟' },
    { id: 'natura', name: 'Natura', logo: '🌿' },
    { id: 'boticario', name: 'O Boticário', logo: '🌺' },
    { id: 'loccitane', name: "L'Occitane", logo: '🌻' },
    { id: 'granado', name: 'Granado', logo: '🌸' }
  ];

  const products: Product[] = [
    {
      id: '1',
      partnerId: 'natura',
      name: 'Hidratante Corporal Ekos Maracujá',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&q=80',
      originalPrice: 89,
      discount: 15,
      finalPrice: 76,
      link: 'https://natura.com.br/produto1?cupom=CLUBEDOLIVRO'
    },
    {
      id: '2',
      partnerId: 'boticario',
      name: 'Creme Hidratante Nativa SPA Matcha',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop&q=80',
      originalPrice: 60,
      discount: 20,
      finalPrice: 48,
      link: 'https://boticario.com.br/produto2?cupom=CLUBEDOLIVRO'
    },
    {
      id: '3',
      partnerId: 'loccitane',
      name: 'Vela Aromática Lavanda Provence',
      image: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=400&h=400&fit=crop&q=80',
      originalPrice: 39,
      discount: 10,
      finalPrice: 35,
      link: 'https://loccitane.com.br/produto3?cupom=CLUBEDOLIVRO'
    },
    {
      id: '4',
      partnerId: 'granado',
      name: 'Sabonete Líquido Tradicional',
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop&q=80',
      originalPrice: 25,
      discount: 12,
      finalPrice: 22,
      link: 'https://granado.com.br/produto4?cupom=CLUBEDOLIVRO'
    },
    {
      id: '5',
      partnerId: 'natura',
      name: 'Perfume Essencial Feminino',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&q=80',
      originalPrice: 120,
      discount: 25,
      finalPrice: 90,
      link: 'https://natura.com.br/produto5?cupom=CLUBEDOLIVRO'
    },
    {
      id: '6',
      partnerId: 'boticario',
      name: 'Kit Malbec Tradicional',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop&q=80',
      originalPrice: 85,
      discount: 18,
      finalPrice: 70,
      link: 'https://boticario.com.br/produto6?cupom=CLUBEDOLIVRO'
    },
    {
      id: '7',
      partnerId: 'loccitane',
      name: 'Creme para Mãos Karité',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&q=80',
      originalPrice: 45,
      discount: 15,
      finalPrice: 38,
      link: 'https://loccitane.com.br/produto7?cupom=CLUBEDOLIVRO'
    },
    {
      id: '8',
      partnerId: 'granado',
      name: 'Kit Sabonetes Vegetais Premium',
      image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400&h=400&fit=crop&q=80',
      originalPrice: 42,
      discount: 15,
      finalPrice: 36,
      link: 'https://granado.com.br/produto8?cupom=CLUBEDOLIVRO'
    },
  ];

  const filteredProducts = selectedPartner === 'all' 
    ? products.slice(0, 3) // Mostra os 3 primeiros produtos quando "all" está selecionado
    : products.filter(product => product.partnerId === selectedPartner);

  const handlePartnerClick = (partnerId: string) => {
    setSelectedPartner(partnerId);
  };

  const handleProductClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-marrom-escuro mb-4">
            🛍️ Shop Exclusivo
          </h1>
          <h2 className="text-2xl md:text-3xl text-terracota mb-4">
            Aproveite descontos exclusivos
          </h2>
          <p className="text-lg text-gray-700">
            em marcas que amamos e confiamos.
          </p>
          
          <div className="flex items-center justify-center my-8">
            <div className="flex-1 border-t border-terracota"></div>
            <span className="px-6 text-terracota font-semibold">Nossos Parceiros</span>
            <div className="flex-1 border-t border-terracota"></div>
          </div>
        </div>

        {/* Filtros de Parceiros */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {partners.map((partner) => (
            <button
              key={partner.id}
              onClick={() => handlePartnerClick(partner.id)}
              className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                selectedPartner === partner.id
                  ? 'bg-terracota text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-rose-50 shadow-md'
              }`}
            >
              <span className="text-3xl mb-2">{partner.logo}</span>
              <span className="font-medium text-sm">{partner.name}</span>
            </button>
          ))}
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {/* Badge de Desconto */}
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{product.discount}% OFF
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-800 mb-3 line-clamp-2">
                  {product.name}
                </h3>
                
                {/* Preços */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gray-400 line-through text-sm">
                    R$ {product.originalPrice}
                  </span>
                  <span className="text-2xl font-bold text-terracota">
                    R$ {product.finalPrice}
                  </span>
                </div>

                {/* Botão de Ação */}
                <button
                  onClick={() => handleProductClick(product.link)}
                  className="w-full bg-terracota hover:bg-marrom-escuro text-white font-semibold py-3 rounded-lg transition-colors duration-300"
                >
                  Acessar Oferta
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <div className="text-center mt-16 p-8 bg-rose-50 rounded-2xl">
          <h3 className="text-xl font-semibold text-marrom-escuro mb-4">
            💝 Benefício Exclusivo
          </h3>
          <p className="text-gray-700 mb-4">
            Como membro do Clube do Livro, você tem acesso a descontos especiais 
            em produtos de autocuidado e bem-estar.
          </p>
          <p className="text-sm text-gray-600">
            ✨ Novos produtos e ofertas são adicionados mensalmente
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shop;