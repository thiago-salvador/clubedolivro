import React, { useState } from 'react';

interface Recommendation {
  id: string;
  type: 'livro' | 'podcast' | 'artigo' | 'video' | 'curso' | 'filme' | 'serie' | 'profissional';
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  link: string;
  rating: number;
  likes: number;
  comments: number;
  submittedBy: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}

const Indicacoes: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [newRecommendation, setNewRecommendation] = useState({
    type: 'livro',
    title: '',
    author: '',
    description: '',
    link: ''
  });
  const [linkPreview, setLinkPreview] = useState<{
    title: string;
    description: string;
    image?: string;
    domain?: string;
  } | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const shouldShowLinkField = () => {
    return newRecommendation.type !== 'livro';
  };

  // Function to generate link preview (simulated)
  const generateLinkPreview = async (url: string) => {
    if (!url || !url.match(/^https?:\/\/.+/)) {
      setLinkPreview(null);
      return;
    }

    setIsLoadingPreview(true);

    // Simulate API delay
    setTimeout(() => {
      const domain = new URL(url).hostname.replace('www.', '');
      
      // Simulate different previews based on domain
      if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
        setLinkPreview({
          title: 'Vídeo Inspirador sobre Empoderamento Feminino',
          description: 'Um conteúdo poderoso que aborda temas de autodescoberta e força interior.',
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
          domain: 'YouTube'
        });
      } else if (domain.includes('spotify.com')) {
        setLinkPreview({
          title: 'Podcast sobre Arquetipos Femininos',
          description: 'Episódio dedicado à exploração dos arquetipos e sua influência em nossas vidas.',
          image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=200&fit=crop',
          domain: 'Spotify'
        });
      } else if (domain.includes('instagram.com')) {
        setLinkPreview({
          title: 'Perfil Profissional - Psicologia Junguiana',
          description: 'Conteúdo especializado em desenvolvimento pessoal e terapia junguiana.',
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
          domain: 'Instagram'
        });
      } else if (domain.includes('amazon.com') || domain.includes('amazon.com.br')) {
        setLinkPreview({
          title: 'Livro sobre Desenvolvimento Pessoal',
          description: 'Obra complementar à nossa jornada de autodescoberta e empoderamento.',
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
          domain: 'Amazon'
        });
      } else if (domain.includes('netflix.com')) {
        setLinkPreview({
          title: 'Série com Protagonista Feminina Forte',
          description: 'Uma narrativa inspiradora sobre jornada pessoal e empoderamento.',
          image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&h=200&fit=crop',
          domain: 'Netflix'
        });
      } else {
        setLinkPreview({
          title: 'Conteúdo Recomendado',
          description: 'Link externo com conteúdo relacionado aos nossos estudos.',
          domain: domain
        });
      }

      setIsLoadingPreview(false);
    }, 1200);
  };

  const contentTypes = [
    { value: 'livro', label: '📚 Livro', icon: '📚', tooltip: 'Livros relacionados ao desenvolvimento pessoal e feminino' },
    { value: 'filme', label: '🎬 Filme', icon: '🎬', tooltip: 'Filmes que abordam temas de empoderamento feminino e jornadas de autodescoberta' },
    { value: 'serie', label: '📺 Série', icon: '📺', tooltip: 'Séries com protagonistas femininas fortes e narrativas inspiradoras' },
    { value: 'profissional', label: '👩‍💼 Profissional', icon: '👩‍💼', tooltip: 'Profissionais especializados em terapia, coaching ou áreas relacionadas' },
    { value: 'podcast', label: '🎧 Podcast', icon: '🎧', tooltip: 'Podcasts sobre crescimento pessoal, espiritualidade e empoderamento' },
    { value: 'artigo', label: '📖 Artigo', icon: '📖', tooltip: 'Artigos e textos reflexivos sobre temas do livro' },
    { value: 'video', label: '🎥 Vídeo', icon: '🎥', tooltip: 'Vídeos educativos, palestras e conteúdos inspiradores' },
    { value: 'curso', label: '🎓 Curso', icon: '🎓', tooltip: 'Cursos e workshops de desenvolvimento pessoal' }
  ];

  const recommendations: Recommendation[] = [
    {
      id: '1',
      type: 'livro',
      title: 'Mulheres que Correm com os Lobos - Volume 2',
      author: 'Clarissa Pinkola Estés',
      description: 'Continuação perfeita da nossa jornada de autodescoberta. Este segundo volume explora ainda mais profundamente os arquétipos femininos.',
      link: 'https://amazon.com.br/livro',
      rating: 5,
      likes: 12,
      comments: 3,
      submittedBy: {
        name: 'Ana Costa'
      },
      createdAt: new Date('2024-03-20')
    },
    {
      id: '2',
      type: 'podcast',
      title: 'Mulheres Selvagens - Podcast',
      author: 'Marina Bastos',
      description: 'Episódios incríveis sobre arquétipos femininos e histórias de transformação. Cada episódio traz uma reflexão profunda.',
      link: 'https://spotify.com/podcast',
      rating: 5,
      likes: 8,
      comments: 5,
      submittedBy: {
        name: 'Julia Santos'
      },
      createdAt: new Date('2024-03-19')
    },
    {
      id: '3',
      type: 'livro',
      title: 'O Poder do Mito',
      author: 'Joseph Campbell',
      description: 'Complementa perfeitamente nossa leitura principal. Campbell explora os mitos universais que moldam nossa psique.',
      link: 'https://amazon.com.br/poder-mito',
      rating: 4,
      likes: 15,
      comments: 7,
      submittedBy: {
        name: 'Mariana Lima'
      },
      createdAt: new Date('2024-03-18')
    },
    {
      id: '4',
      type: 'filme',
      title: 'Moana - Um Mar de Aventuras',
      author: 'Disney',
      description: 'Uma jornada de autodescoberta e conexão com a natureza que ressoa com os ensinamentos do livro.',
      link: 'https://www.disneyplus.com/movies/moana',
      rating: 5,
      likes: 20,
      comments: 12,
      submittedBy: {
        name: 'Carolina Souza'
      },
      createdAt: new Date('2024-03-17')
    },
    {
      id: '5',
      type: 'serie',
      title: 'Anne with an E',
      author: 'CBC/Netflix',
      description: 'Uma série que mostra o despertar de uma jovem mulher para sua força interior e individualidade.',
      link: 'https://www.netflix.com/title/80136311',
      rating: 4,
      likes: 18,
      comments: 9,
      submittedBy: {
        name: 'Patricia Reis'
      },
      createdAt: new Date('2024-03-16')
    },
    {
      id: '6',
      type: 'profissional',
      title: 'Dra. Amanda Psicóloga Junguiana',
      author: 'Dra. Amanda Silva',
      description: 'Psicóloga especializada em arquétipos femininos e terapia junguiana. Atendimento presencial e online.',
      link: 'https://instagram.com/dra.amanda.psicologa',
      rating: 5,
      likes: 25,
      comments: 15,
      submittedBy: {
        name: 'Beatriz Costa'
      },
      createdAt: new Date('2024-03-15')
    }
  ];

  const filteredRecommendations = selectedType === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === selectedType);

  const handleSubmitRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria a lógica para enviar a indicação
    console.log('Nova indicação:', newRecommendation);
    // Reset form
    setNewRecommendation({
      type: 'livro',
      title: '',
      author: '',
      description: '',
      link: ''
    });
    // Clear preview
    setLinkPreview(null);
    setIsLoadingPreview(false);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setNewRecommendation({
      ...newRecommendation, 
      type: newType,
      // Limpar link quando trocar para livro
      link: newType === 'livro' ? '' : newRecommendation.link
    });
    
    // Clear preview when changing type
    setLinkPreview(null);
    setIsLoadingPreview(false);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLink = e.target.value;
    setNewRecommendation({
      ...newRecommendation,
      link: newLink
    });

    // Generate preview for valid URLs
    if (newLink && newLink.match(/^https?:\/\/.+/)) {
      generateLinkPreview(newLink);
    } else {
      setLinkPreview(null);
      setIsLoadingPreview(false);
    }
  };

  const handleLike = (recommendationId: string) => {
    // Lógica para curtir uma indicação
    console.log('Curtindo indicação:', recommendationId);
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = contentTypes.find(t => t.value === type);
    return typeConfig?.icon || '📄';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Block */}
      <div className="bg-verde-oliva text-white rounded-xl p-6 shadow-sm">
        <p className="text-lg flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <span>
            Compartilhe suas descobertas literárias! Indique livros, podcasts e conteúdos 
            inspiradores que complementam nossa jornada de autodescoberta. Vamos crescer juntas 
            através do conhecimento compartilhado.
          </span>
        </p>
      </div>

      {/* New Recommendation Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>✨</span>
          Nova Indicação
        </h3>
        
        <form onSubmit={handleSubmitRecommendation} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Tipo de Conteúdo
                <span 
                  title={contentTypes.find(t => t.value === newRecommendation.type)?.tooltip}
                  className="cursor-help text-gray-400 hover:text-terracota transition-colors"
                >
                  ℹ️
                </span>
              </label>
              <select
                value={newRecommendation.type}
                onChange={handleTypeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
              >
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {newRecommendation.type === 'livro' && (
                <p className="text-xs text-gray-500 mt-1">
                  💡 Para livros, o campo "Link" fica oculto automaticamente.
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={newRecommendation.title}
                onChange={(e) => setNewRecommendation({...newRecommendation, title: e.target.value})}
                placeholder="Digite o título"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autor/Criador
              </label>
              <input
                type="text"
                value={newRecommendation.author}
                onChange={(e) => setNewRecommendation({...newRecommendation, author: e.target.value})}
                placeholder="Nome do autor ou criador"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                required
              />
            </div>

            {shouldShowLinkField() && (
              <div className="transition-all duration-300 ease-in-out">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link (opcional)
                </label>
                <input
                  type="url"
                  value={newRecommendation.link}
                  onChange={handleLinkChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Link Preview */}
          {shouldShowLinkField() && newRecommendation.link && (
            <div className="transition-all duration-300 ease-in-out">
              {isLoadingPreview && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-terracota"></div>
                    <span className="text-sm text-gray-600">Gerando preview do link...</span>
                  </div>
                </div>
              )}
              
              {linkPreview && !isLoadingPreview && (
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex gap-3">
                    {linkPreview.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={linkPreview.image}
                          alt="Preview"
                          className="w-20 h-16 object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {linkPreview.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {linkPreview.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <span>🔗</span>
                        <span>{linkPreview.domain}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Por que você recomenda?
            </label>
            <textarea
              value={newRecommendation.description}
              onChange={(e) => setNewRecommendation({...newRecommendation, description: e.target.value})}
              rows={3}
              placeholder="Conte por que esta indicação é especial e como ela se conecta com nossa jornada..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-2 text-gray-600 hover:text-terracota transition-colors"
            >
              <span>📎</span>
              <span className="text-sm">Anexar Capa</span>
            </button>
            
            <button
              type="submit"
              className="px-6 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
            >
              💾 Publicar Indicação
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-terracota text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          {contentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === type.value
                  ? 'bg-terracota text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Feed */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <span>📚</span>
          Indicações da Comunidade
        </h3>

        <div className="space-y-6">
          {filteredRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
              <div className="flex items-start gap-4">
                {/* Content Icon/Cover */}
                <div className="flex-shrink-0 w-16 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">{getTypeIcon(recommendation.type)}</span>
                </div>

                {/* Content Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 mb-1">
                        {recommendation.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        Por {recommendation.author} • {contentTypes.find(t => t.value === recommendation.type)?.label}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {renderStars(recommendation.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          ({recommendation.likes} curtidas)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                    "{recommendation.description}"
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <button
                      onClick={() => handleLike(recommendation.id)}
                      className="flex items-center gap-1 text-gray-600 hover:text-terracota transition-colors"
                    >
                      <span>❤️</span>
                      <span>Curtir</span>
                    </button>
                    
                    <button className="flex items-center gap-1 text-gray-600 hover:text-terracota transition-colors">
                      <span>💬</span>
                      <span>{recommendation.comments} Comentários</span>
                    </button>

                    {recommendation.link && (
                      <a
                        href={recommendation.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-terracota hover:text-marrom-escuro transition-colors"
                      >
                        <span>🔗</span>
                        <span>Acessar</span>
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Indicado por {recommendation.submittedBy.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Indicacoes;