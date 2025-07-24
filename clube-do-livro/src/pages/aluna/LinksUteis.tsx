import React, { useState, useEffect } from 'react';
import { cacheService, CACHE_KEYS } from '../../services/cache.service';

interface Link {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'livro' | 'psicologia' | 'feminino' | 'meditacao' | 'podcasts' | 'cursos' | 'comunidade';
  icon?: string;
  image?: string;
  tags: string[];
  clickCount: number;
  isFavorite?: boolean;
}

const LinksUteis: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isNewLinkModalOpen, setIsNewLinkModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newLinkSuggestion, setNewLinkSuggestion] = useState({
    title: '',
    description: '',
    url: '',
    category: 'livro' as Link['category'],
    tags: ''
  });

  // Dados dos links úteis
  const initialLinks: Link[] = [
    {
      id: '1',
      title: 'Site Oficial de Clarissa Pinkola Estés',
      description: 'Conheça mais sobre a autora e sua obra, incluindo outros livros e recursos.',
      url: 'https://www.clarissapinkolaestes.com',
      category: 'livro',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
      tags: ['autora', 'biografia', 'obras'],
      clickCount: 0
    },
    {
      id: '2',
      title: 'TED Talk: O Poder da Vulnerabilidade - Brené Brown',
      description: 'Palestra inspiradora sobre vulnerabilidade, coragem e conexão humana.',
      url: 'https://www.ted.com/talks/brene_brown_the_power_of_vulnerability',
      category: 'psicologia',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=200&fit=crop',
      tags: ['vulnerabilidade', 'coragem', 'autenticidade'],
      clickCount: 0
    },
    {
      id: '3',
      title: 'Círculo de Mulheres - Como Criar',
      description: 'Guia completo para formar e facilitar círculos de mulheres em sua comunidade.',
      url: 'https://www.circulodemulheres.com.br',
      category: 'feminino',
      image: 'https://images.unsplash.com/photo-1609234656388-0ff363383899?w=400&h=200&fit=crop',
      tags: ['círculo', 'comunidade', 'sororidade'],
      clickCount: 0
    },
    {
      id: '4',
      title: 'Insight Timer - Meditações Guiadas',
      description: 'App gratuito com milhares de meditações, incluindo práticas para o feminino sagrado.',
      url: 'https://insighttimer.com',
      category: 'meditacao',
      icon: '🧘‍♀️',
      tags: ['meditação', 'mindfulness', 'app'],
      clickCount: 0
    },
    {
      id: '5',
      title: 'Podcast: Mamilos',
      description: 'Discussões profundas sobre feminismo, sociedade e questões contemporâneas.',
      url: 'https://www.b9.com.br/shows/mamilos/',
      category: 'podcasts',
      icon: '🎙️',
      tags: ['feminismo', 'sociedade', 'debates'],
      clickCount: 0
    },
    {
      id: '6',
      title: 'Curso Online: Psicologia Feminina Junguiana',
      description: 'Aprofunde-se nos arquétipos femininos e na psicologia analítica de Jung.',
      url: 'https://www.cursopsicologiajung.com',
      category: 'cursos',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=200&fit=crop',
      tags: ['jung', 'arquétipos', 'psicologia'],
      clickCount: 0
    },
    {
      id: '7',
      title: 'Instituto Amma - Psicologia e Espiritualidade',
      description: 'Centro de estudos sobre o feminino, oferecendo cursos e formações.',
      url: 'https://www.institutoamma.com.br',
      category: 'cursos',
      tags: ['formação', 'feminino', 'espiritualidade'],
      clickCount: 0
    },
    {
      id: '8',
      title: 'Rede Mulheres que Escrevem',
      description: 'Comunidade online de mulheres escritoras, com oficinas e encontros virtuais.',
      url: 'https://www.mulheresqueescrevem.com.br',
      category: 'comunidade',
      icon: '✍️',
      tags: ['escrita', 'comunidade', 'criatividade'],
      clickCount: 0
    },
    {
      id: '9',
      title: 'Canal YouTube: Escola de Mulheres',
      description: 'Vídeos sobre autoconhecimento, ciclos femininos e sabedoria ancestral.',
      url: 'https://youtube.com/escolademulheres',
      category: 'feminino',
      icon: '📺',
      tags: ['vídeos', 'ciclos', 'autoconhecimento'],
      clickCount: 0
    },
    {
      id: '10',
      title: 'Livro: "O Despertar do Feminino" - Lara Owen',
      description: 'Obra complementar sobre a jornada de reconexão com a essência feminina.',
      url: 'https://www.amazon.com.br/despertar-feminino',
      category: 'livro',
      tags: ['leitura', 'complementar', 'feminino'],
      clickCount: 0
    },
    {
      id: '11',
      title: 'App Clue - Acompanhamento do Ciclo',
      description: 'Aplicativo para acompanhar seu ciclo menstrual e compreender melhor seu corpo.',
      url: 'https://helloclue.com',
      category: 'feminino',
      icon: '🌙',
      tags: ['ciclo', 'corpo', 'app'],
      clickCount: 0
    },
    {
      id: '12',
      title: 'Podcast: Para Todas',
      description: 'Conversas sobre feminilidade, maternidade e os desafios da mulher moderna.',
      url: 'https://paratodas.com.br',
      category: 'podcasts',
      icon: '🎧',
      tags: ['maternidade', 'feminilidade', 'conversas'],
      clickCount: 0
    }
  ];

  const categories = [
    { value: 'all', label: 'Todos', icon: '🔗' },
    { value: 'livro', label: 'Livros & Leituras', icon: '📚' },
    { value: 'psicologia', label: 'Psicologia', icon: '🧠' },
    { value: 'feminino', label: 'Feminino Sagrado', icon: '🌸' },
    { value: 'meditacao', label: 'Meditação', icon: '🧘‍♀️' },
    { value: 'podcasts', label: 'Podcasts', icon: '🎙️' },
    { value: 'cursos', label: 'Cursos & Formações', icon: '🎓' },
    { value: 'comunidade', label: 'Comunidades', icon: '👥' }
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load links with cache (3 days TTL)
        const cachedLinks = await cacheService.getOrFetch<Link[]>(
          CACHE_KEYS.LINKS,
          async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 100));
            return initialLinks;
          },
          3 * 24 * 60 * 60 * 1000 // 3 days
        );

        // Carregar favoritos e contadores do localStorage
        const savedFavorites = localStorage.getItem('link_favorites');
        if (savedFavorites) {
          setFavorites(new Set(JSON.parse(savedFavorites)));
        }

        const savedCounts = localStorage.getItem('link_click_counts');
        if (savedCounts) {
          setClickCounts(JSON.parse(savedCounts));
        }

        // Inicializar links com contadores salvos
        setLinks(cachedLinks.map(link => ({
          ...link,
          clickCount: savedCounts ? JSON.parse(savedCounts)[link.id] || 0 : 0
        })));
      } catch (error) {
        console.error('Error loading links:', error);
        // Fallback to initial data
        setLinks(initialLinks);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleFavorite = (linkId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(linkId)) {
      newFavorites.delete(linkId);
    } else {
      newFavorites.add(linkId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('link_favorites', JSON.stringify(Array.from(newFavorites)));
  };

  const handleLinkClick = (linkId: string) => {
    const newCounts = {
      ...clickCounts,
      [linkId]: (clickCounts[linkId] || 0) + 1
    };
    setClickCounts(newCounts);
    localStorage.setItem('link_click_counts', JSON.stringify(newCounts));
    
    // Atualizar o contador no estado
    setLinks(links.map(link => 
      link.id === linkId 
        ? { ...link, clickCount: link.clickCount + 1 }
        : link
    ));
  };

  const handleSuggestLink = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!newLinkSuggestion.title.trim() || !newLinkSuggestion.url.trim()) {
      alert('Por favor, preencha pelo menos o título e a URL.');
      return;
    }

    // Em produção, enviaria para o backend
    console.log('Nova sugestão de link:', newLinkSuggestion);
    
    // Salvar sugestão no localStorage (simulando envio)
    const savedSuggestions = JSON.parse(localStorage.getItem('link_suggestions') || '[]');
    const suggestion = {
      ...newLinkSuggestion,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      tags: newLinkSuggestion.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    savedSuggestions.push(suggestion);
    localStorage.setItem('link_suggestions', JSON.stringify(savedSuggestions));
    
    // Reset form
    setNewLinkSuggestion({
      title: '',
      description: '',
      url: '',
      category: 'livro',
      tags: ''
    });
    setIsNewLinkModalOpen(false);
    
    alert('Obrigada pela sugestão! Ela será analisada pela equipe e poderá ser adicionada à biblioteca.');
  };

  // Filtrar links
  let filteredLinks = [...links];

  if (selectedCategory !== 'all') {
    filteredLinks = filteredLinks.filter(link => link.category === selectedCategory);
  }

  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    filteredLinks = filteredLinks.filter(link =>
      link.title.toLowerCase().includes(search) ||
      link.description.toLowerCase().includes(search) ||
      link.tags.some(tag => tag.toLowerCase().includes(search))
    );
  }

  if (showOnlyFavorites) {
    filteredLinks = filteredLinks.filter(link => favorites.has(link.id));
  }

  // Ordenar por popularidade (cliques) e depois por título
  filteredLinks.sort((a, b) => {
    if (b.clickCount !== a.clickCount) {
      return b.clickCount - a.clickCount;
    }
    return a.title.localeCompare(b.title);
  });

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.icon || '🔗';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando recursos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span>🔗</span>
          Links Úteis
        </h1>
        <p className="text-gray-700">
          Recursos cuidadosamente selecionados para complementar sua jornada de autoconhecimento.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar links por título, descrição ou tags..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
          />
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-terracota text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyFavorites}
                onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                className="rounded text-terracota focus:ring-terracota"
              />
              <span className="text-sm text-gray-700">Mostrar apenas favoritos</span>
            </label>
            
            {favorites.size > 0 && (
              <span className="text-sm text-gray-500">
                {favorites.size} link{favorites.size > 1 ? 's' : ''} favoritado{favorites.size > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <button
            onClick={() => setIsNewLinkModalOpen(true)}
            className="px-4 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            Sugerir Link
          </button>
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link) => (
            <div key={link.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image or Icon */}
              {link.image ? (
                <div className="aspect-video bg-gray-200">
                  <img
                    src={link.image}
                    alt={link.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <span className="text-5xl">{link.icon || getCategoryIcon(link.category)}</span>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex-1 mr-2">
                    {link.title}
                  </h3>
                  <button
                    onClick={() => toggleFavorite(link.id)}
                    className={`text-2xl transition-colors ${
                      favorites.has(link.id) ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    {favorites.has(link.id) ? '⭐' : '☆'}
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {link.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {link.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link.id)}
                    className="text-terracota hover:text-marrom-escuro font-medium text-sm flex items-center gap-1"
                  >
                    Visitar <span>→</span>
                  </a>
                  
                  <span className="text-xs text-gray-500">
                    {link.clickCount > 0 && `${link.clickCount} visita${link.clickCount > 1 ? 's' : ''}`}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' || showOnlyFavorites
                ? 'Nenhum link encontrado com os filtros aplicados.'
                : 'Nenhum link disponível no momento.'}
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>💡</span>
          Sugestões de uso:
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Marque seus links favoritos com a estrela para acesso rápido</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Use a busca para encontrar recursos sobre temas específicos</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Os links mais visitados aparecem primeiro na lista</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Explore diferentes categorias para descobrir novos recursos</span>
          </li>
        </ul>
      </div>

      {/* Modal Sugerir Novo Link */}
      {isNewLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Sugerir Novo Link</h2>
                <button
                  onClick={() => setIsNewLinkModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSuggestLink} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Link *
                  </label>
                  <input
                    type="text"
                    value={newLinkSuggestion.title}
                    onChange={(e) => setNewLinkSuggestion({...newLinkSuggestion, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                    placeholder="Ex: TED Talk inspirador sobre feminino"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    value={newLinkSuggestion.url}
                    onChange={(e) => setNewLinkSuggestion({...newLinkSuggestion, url: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                    placeholder="https://..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={newLinkSuggestion.category}
                    onChange={(e) => setNewLinkSuggestion({...newLinkSuggestion, category: e.target.value as Link['category']})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  >
                    {categories.filter(c => c.value !== 'all').map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={newLinkSuggestion.description}
                    onChange={(e) => setNewLinkSuggestion({...newLinkSuggestion, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                    placeholder="Descreva brevemente o conteúdo e por que é útil..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (opcional)
                  </label>
                  <input
                    type="text"
                    value={newLinkSuggestion.tags}
                    onChange={(e) => setNewLinkSuggestion({...newLinkSuggestion, tags: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                    placeholder="Ex: autoestima, empoderamento, crescimento"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separe as tags com vírgulas</p>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsNewLinkModalOpen(false)}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-terracota text-white rounded-lg hover:bg-marrom-escuro transition-colors"
                  >
                    Enviar Sugestão
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinksUteis;