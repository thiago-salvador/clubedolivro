import React, { useState, useEffect, useRef } from 'react';
import { useSwipe } from '../../hooks/useSwipe';
import { cacheService, CACHE_KEYS } from '../../services/cache.service';

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
  description?: string;
  additionalImages?: string[];
  conditions?: string;
}

const Shop: React.FC = () => {
  const [selectedPartner, setSelectedPartner] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasReadDisclaimer, setHasReadDisclaimer] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Static data for partners and products
  const defaultPartners: Partner[] = [
    { id: 'all', name: 'Todos', logo: '🌟' },
    { id: 'natura', name: 'Natura', logo: '🌿' },
    { id: 'boticario', name: 'O Boticário', logo: '🌺' },
    { id: 'loccitane', name: "L'Occitane", logo: '🌻' },
    { id: 'granado', name: 'Granado', logo: '🌸' }
  ];

  const defaultProducts: Product[] = [
    {
      id: '1',
      partnerId: 'natura',
      name: 'Hidratante Corporal Ekos Maracujá',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&q=80',
      originalPrice: 89,
      discount: 15,
      finalPrice: 76,
      link: 'https://natura.com.br/produto1?cupom=CLUBEDOLIVRO',
      description: 'O Hidratante Corporal Ekos Maracujá oferece hidratação intensa com a fragrância revigorante do maracujá brasileiro. Sua fórmula rica em ingredientes naturais da biodiversidade brasileira proporciona maciez e nutrição profunda para a pele.',
      additionalImages: [
        'https://images.unsplash.com/photo-1608068811588-3a67006b7489?w=400&h=400&fit=crop&q=80',
        'https://images.unsplash.com/photo-1570194065650-d9c1f7d03d95?w=400&h=400&fit=crop&q=80'
      ],
      conditions: 'Desconto exclusivo de 15% para membros do Clube do Livro. Válido por tempo limitado ou enquanto durarem os estoques.'
    },
    {
      id: '2',
      partnerId: 'boticario',
      name: 'Creme Hidratante Nativa SPA Matcha',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop&q=80',
      originalPrice: 60,
      discount: 20,
      finalPrice: 48,
      link: 'https://boticario.com.br/produto2?cupom=CLUBEDOLIVRO',
      description: 'O Creme Hidratante Nativa SPA Matcha combina o poder antioxidante do chá verde matcha com uma textura cremosa que nutre profundamente. Ideal para todos os tipos de pele.',
      conditions: 'Oferta especial com 20% de desconto exclusivo para membros. Cupom válido até o final do mês.'
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

  // Load data with cache
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load partners with cache (1 week TTL)
        const cachedPartners = await cacheService.getOrFetch<Partner[]>(
          CACHE_KEYS.PARTNERS,
          async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 100));
            return defaultPartners;
          },
          7 * 24 * 60 * 60 * 1000 // 7 days
        );
        setPartners(cachedPartners);

        // Load products with cache (1 day TTL)
        const cachedProducts = await cacheService.getOrFetch<Product[]>(
          CACHE_KEYS.PRODUCTS,
          async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 100));
            return defaultProducts;
          },
          24 * 60 * 60 * 1000 // 1 day
        );
        setProducts(cachedProducts);
      } catch (error) {
        console.error('Error loading shop data:', error);
        // Fallback to default data
        setPartners(defaultPartners);
        setProducts(defaultProducts);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = selectedPartner === 'all' 
    ? products.slice(0, 3) // Mostra os 3 primeiros produtos quando "all" está selecionado
    : products.filter(product => product.partnerId === selectedPartner);

  const handlePartnerClick = (partnerId: string) => {
    setSelectedPartner(partnerId);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setHasReadDisclaimer(false);
    setSelectedImageIndex(0);
    
    // Track modal view
    console.log('Product details viewed:', {
      event: 'product_details_viewed',
      productId: product.id,
      productName: product.name,
      partnerId: product.partnerId
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setHasReadDisclaimer(false);
  };

  // Gallery navigation
  const getAllImages = () => {
    if (!selectedProduct) return [];
    const images = [selectedProduct.image];
    if (selectedProduct.additionalImages) {
      images.push(...selectedProduct.additionalImages);
    }
    return images;
  };

  const handlePreviousImage = () => {
    const images = getAllImages();
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const images = getAllImages();
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Swipe handlers
  useSwipe(galleryRef, {
    onSwipeLeft: handleNextImage,
    onSwipeRight: handlePreviousImage,
  });

  const handleAccessOffer = () => {
    if (selectedProduct && hasReadDisclaimer) {
      // Track click event
      trackProductClick(selectedProduct);
      
      window.open(selectedProduct.link, '_blank', 'noopener,noreferrer');
      handleCloseModal();
    }
  };

  // Analytics tracking function
  const trackProductClick = (product: Product) => {
    // Save to localStorage for analytics
    const clicks = JSON.parse(localStorage.getItem('product_clicks') || '[]');
    clicks.push({
      productId: product.id,
      productName: product.name,
      partnerId: product.partnerId,
      discount: product.discount,
      finalPrice: product.finalPrice,
      timestamp: new Date().toISOString(),
      userId: localStorage.getItem('userId') || 'anonymous'
    });
    localStorage.setItem('product_clicks', JSON.stringify(clicks));

    // Log for analytics service integration
    console.log('Product click tracked:', {
      event: 'product_offer_accessed',
      productId: product.id,
      productName: product.name,
      partnerId: product.partnerId,
      discount: product.discount,
      value: product.finalPrice
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen && e.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracota mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando ofertas exclusivas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Banner Benefício Exclusivo */}
        <div className="bg-gradient-to-r from-terracota to-marrom-escuro text-white p-6 rounded-2xl shadow-lg mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                💝 Benefício Exclusivo para Membros
              </h2>
              <p className="text-white/90">
                Como membro do Clube do Livro, você tem acesso a descontos especiais 
                em produtos de autocuidado e bem-estar.
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-sm font-semibold">Até 25% OFF</p>
              <p className="text-xs">em produtos selecionados</p>
            </div>
          </div>
        </div>

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
              className={`flex flex-col items-center p-4 min-w-[80px] min-h-[80px] rounded-xl transition-all duration-300 hover:scale-105 ${
                selectedPartner === partner.id
                  ? 'bg-terracota text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-rose-50 shadow-md'
              }`}
              aria-label={`Filtrar por ${partner.name}`}
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
                  onClick={() => handleProductClick(product)}
                  className="w-full bg-terracota hover:bg-marrom-escuro text-white font-semibold py-4 rounded-lg transition-colors duration-300 min-h-[48px]"
                  aria-label={`Ver detalhes do produto ${product.name}`}
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <div className="text-center mt-16 p-8 bg-gray-50 rounded-2xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            ✨ Mais Benefícios em Breve
          </h3>
          <p className="text-gray-600 mb-4">
            Estamos sempre negociando novos descontos e parcerias especiais para você.
          </p>
          <p className="text-sm text-gray-500">
            💌 Novos produtos e ofertas são adicionados mensalmente
          </p>
        </div>
      </div>

      {/* Modal de Detalhes do Produto */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Detalhes da Oferta</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 -m-2 rounded-lg hover:bg-gray-100"
                aria-label="Fechar modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Imagem Principal e Galeria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4">
                  {/* Galeria com Swipe */}
                  <div ref={galleryRef} className="relative">
                    <img 
                      src={getAllImages()[selectedImageIndex]} 
                      alt={`${selectedProduct.name} - Imagem ${selectedImageIndex + 1}`}
                      className="w-full h-64 sm:h-80 object-cover rounded-lg select-none"
                      draggable={false}
                    />
                    
                    {/* Indicadores de imagem */}
                    {getAllImages().length > 1 && (
                      <>
                        {/* Botões de navegação */}
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          aria-label="Imagem anterior"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          aria-label="Próxima imagem"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        {/* Indicadores de posição */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {getAllImages().map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === selectedImageIndex 
                                  ? 'bg-white w-8' 
                                  : 'bg-white/50 hover:bg-white/70'
                              }`}
                              aria-label={`Ir para imagem ${index + 1}`}
                            />
                          ))}
                        </div>
                        
                        {/* Indicador de swipe para mobile */}
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/70 text-sm md:hidden">
                          <span className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                            <span>←</span> Deslize <span>→</span>
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Miniaturas */}
                  {getAllImages().length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-4 gap-1 sm:gap-2">
                      {getAllImages().map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative rounded-lg overflow-hidden ${
                            index === selectedImageIndex ? 'ring-2 ring-terracota' : ''
                          }`}
                        >
                          <img 
                            src={img} 
                            alt={`${selectedProduct.name} miniatura ${index + 1}`}
                            className="w-full h-16 sm:h-20 object-cover hover:opacity-80 transition-opacity"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Informações do Produto */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <span className="inline-block px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-semibold mb-2">
                      -{selectedProduct.discount}% OFF Exclusivo
                    </span>
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProduct.description || 'Produto de alta qualidade selecionado especialmente para os membros do Clube do Livro.'}
                    </p>
                  </div>

                  {/* Preços */}
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <span className="text-gray-400 line-through text-base sm:text-lg">
                        R$ {selectedProduct.originalPrice}
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold text-terracota">
                        R$ {selectedProduct.finalPrice}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Economia de R$ {(selectedProduct.originalPrice - selectedProduct.finalPrice).toFixed(2)}
                    </p>
                  </div>

                  {/* Condições */}
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <span>ℹ️</span>
                      Condições da Oferta
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-800">
                      {selectedProduct.conditions || 'Oferta exclusiva para membros do Clube do Livro. Sujeito a disponibilidade.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Aviso Legal */}
              <div className="bg-amber-50 border-2 border-amber-200 p-4 sm:p-6 rounded-lg">
                <h4 className="font-bold text-amber-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-xl sm:text-2xl">⚠️</span>
                  Aviso Importante
                </h4>
                <p className="text-amber-800 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                  Ao clicar em "Acessar Oferta", você será redirecionada para o site do parceiro. 
                  O Clube do Livro não se responsabiliza por transações realizadas em sites externos. 
                  Verifique sempre as políticas de privacidade e termos de uso do parceiro antes de 
                  efetuar qualquer compra.
                </p>
                <label className="flex items-start gap-3 cursor-pointer p-2 -m-2 rounded-lg hover:bg-amber-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasReadDisclaimer}
                    onChange={(e) => setHasReadDisclaimer(e.target.checked)}
                    className="mt-1 w-5 h-5 text-terracota border-2 border-gray-300 rounded focus:ring-terracota cursor-pointer"
                  />
                  <span className="text-sm text-amber-800 select-none">
                    Li e compreendi o aviso acima
                  </span>
                </label>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors min-h-[48px]"
                >
                  Voltar
                </button>
                <button
                  onClick={handleAccessOffer}
                  disabled={!hasReadDisclaimer}
                  className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all min-h-[48px] ${
                    hasReadDisclaimer 
                      ? 'bg-terracota text-white hover:bg-marrom-escuro' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label={hasReadDisclaimer ? 'Acessar oferta do parceiro' : 'Aceite o aviso para continuar'}
                >
                  Acessar Oferta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;