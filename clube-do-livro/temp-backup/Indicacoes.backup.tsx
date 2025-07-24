import React, { useState } from 'react';

interface Recommendation {
  id: string;
  type: 'livro' | 'podcast' | 'artigo' | 'video' | 'curso';
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

  const contentTypes = [
    { value: 'livro', label: '📚 Livro', icon: '📚' },
    { value: 'podcast', label: '🎧 Podcast', icon: '🎧' },
    { value: 'artigo', label: '📖 Artigo', icon: '📖' },
    { value: 'video', label: '🎥 Vídeo', icon: '🎥' },
    { value: 'curso', label: '🎓 Curso', icon: '🎓' }
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
  };

  const getTypeIcon = (type: string) => {
    const typeData = contentTypes.find(t => t.value === type);
    return typeData?.icon || '📄';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          📚 Indicações da Comunidade
        </h1>
        <p className="text-gray-700">
          Compartilhe e descubra livros, podcasts, vídeos e outros conteúdos que 
          complementam nossa jornada de autodescoberta.
        </p>
      </div>

      {/* New Recommendation Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>✨</span>
          Nova Indicação
        </h2>
        
        <form onSubmit={handleSubmitRecommendation} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Conteúdo
              </label>
              <select
                value={newRecommendation.type}
                onChange={(e) => setNewRecommendation({...newRecommendation, type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
              >
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={newRecommendation.title}
                onChange={(e) => setNewRecommendation({...newRecommendation, title: e.target.value})}
                placeholder="Nome do livro, podcast, artigo..."
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link (opcional)
              </label>
              <input
                type="url"
                value={newRecommendation.link}
                onChange={(e) => setNewRecommendation({...newRecommendation, link: e.target.value})}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
              />
            </div>
          </div>

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
                          • {recommendation.likes} curtidas • {recommendation.comments} comentários
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">
                    {recommendation.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Indicado por {recommendation.submittedBy.name} • {recommendation.createdAt.toLocaleDateString('pt-BR')}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      {recommendation.link && (
                        <a
                          href={recommendation.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-terracota text-white text-sm rounded-lg hover:bg-marrom-escuro transition-colors"
                        >
                          🔗 Ver Conteúdo
                        </a>
                      )}
                      
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                        ❤️ {recommendation.likes}
                      </button>
                      
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                        💬 {recommendation.comments}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecommendations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Nenhuma indicação encontrada para este filtro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Indicacoes;