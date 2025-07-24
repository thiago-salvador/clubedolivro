import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface WorkPost {
  id: string;
  category: 'proposito' | 'transicao' | 'lideranca' | 'equilibrio' | 'realizacao' | 'desafios';
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  likes: number;
  replies: WorkReply[];
  createdAt: Date;
  tags?: string[];
}

interface WorkReply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    isFacilitator?: boolean;
  };
  likes: number;
  createdAt: Date;
}

const Trabalho: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<'recent' | 'popular' | 'unanswered'>('recent');
  const [newPost, setNewPost] = useState({
    category: 'proposito',
    title: '',
    content: '',
    tags: ''
  });

  const workCategories = [
    { value: 'proposito', label: '✨ Propósito', icon: '✨' },
    { value: 'transicao', label: '🔄 Transição de Carreira', icon: '🔄' },
    { value: 'lideranca', label: '👩‍💼 Liderança Feminina', icon: '👩‍💼' },
    { value: 'equilibrio', label: '⚖️ Equilíbrio Vida-Trabalho', icon: '⚖️' },
    { value: 'realizacao', label: '🎯 Realização Profissional', icon: '🎯' },
    { value: 'desafios', label: '💪 Desafios', icon: '💪' }
  ];

  const posts: WorkPost[] = [
    {
      id: '1',
      category: 'proposito',
      title: 'Encontrando meu propósito aos 40 anos',
      content: 'Depois de 15 anos na mesma empresa, sinto que perdi minha essência. O livro tem me ajudado a reconectar com meus verdadeiros talentos. Alguém mais está repensando sua carreira depois de ler sobre os arquétipos?',
      author: { name: 'Fernanda Lima' },
      likes: 34,
      tags: ['mudança', 'propósito', 'autoconhecimento'],
      replies: [
        {
          id: '1-1',
          content: 'Estou exatamente na mesma situação! Descobri que meu arquétipo principal é a Criadora e agora entendo porque me sinto tão sufocada em um trabalho puramente administrativo.',
          author: { name: 'Patricia Souza' },
          likes: 12,
          createdAt: new Date('2024-03-20T14:30:00')
        },
        {
          id: '1-2',
          content: 'É maravilhoso ver vocês redescobrindo seus talentos! Lembrem-se que a transformação profissional é um processo. Sejam gentis consigo mesmas durante essa jornada.',
          author: { name: 'Manu Xavier', isFacilitator: true },
          likes: 28,
          createdAt: new Date('2024-03-20T15:00:00')
        }
      ],
      createdAt: new Date('2024-03-20T10:00:00')
    },
    {
      id: '2',
      category: 'lideranca',
      title: 'Liderando com o feminino em um ambiente masculino',
      content: 'Como liderar sendo autêntica em um ambiente corporativo dominado por homens? Sinto que preciso ser "dura" para ser respeitada, mas isso vai contra minha natureza. O capítulo sobre a Mulher Selvagem me fez questionar tudo.',
      author: { name: 'Carolina Mendes' },
      likes: 45,
      tags: ['liderança', 'feminino', 'autenticidade'],
      replies: [
        {
          id: '2-1',
          content: 'Eu aprendi que ser forte não significa ser dura. Lidero com empatia e intuição, e isso tem sido meu diferencial. Não precisamos imitar o masculino para sermos respeitadas.',
          author: { name: 'Beatriz Oliveira' },
          likes: 23,
          createdAt: new Date('2024-03-19T16:30:00')
        }
      ],
      createdAt: new Date('2024-03-19T14:00:00')
    },
    {
      id: '3',
      category: 'transicao',
      title: 'De executiva a empreendedora: minha jornada',
      content: 'Larguei um cargo de diretoria para abrir meu próprio negócio focado em bem-estar feminino. Foi assustador, mas o livro me deu coragem para seguir minha intuição. Alguém mais deu esse salto?',
      author: { name: 'Juliana Ramos' },
      likes: 67,
      tags: ['empreendedorismo', 'coragem', 'transição'],
      replies: [],
      createdAt: new Date('2024-03-18T11:00:00')
    },
    {
      id: '4',
      category: 'equilibrio',
      title: 'Maternidade e carreira: como não me perder?',
      content: 'Voltei da licença maternidade e sinto que preciso provar meu valor dobrado. Como equilibrar o cuidado com minha bebê e as demandas do trabalho sem me esgotar? O conceito da "mãe selvagem" tem me feito refletir muito.',
      author: { name: 'Amanda Silva' },
      likes: 52,
      tags: ['maternidade', 'equilíbrio', 'burnout'],
      replies: [
        {
          id: '4-1',
          content: 'Não tente ser perfeita em tudo. Aprendi que estabelecer prioridades claras e pedir ajuda não é fraqueza. Você não precisa provar nada para ninguém!',
          author: { name: 'Renata Costa' },
          likes: 18,
          createdAt: new Date('2024-03-17T09:30:00')
        }
      ],
      createdAt: new Date('2024-03-17T08:00:00')
    },
    {
      id: '5',
      category: 'desafios',
      title: 'Síndrome da impostora: como superar?',
      content: 'Fui promovida recentemente mas sinto que não mereço. A síndrome da impostora está me paralisando. Como vocês lidam com essa sensação? Os exercícios do livro têm ajudado?',
      author: { name: 'Luciana Ferreira' },
      likes: 38,
      tags: ['síndrome impostora', 'autoconfiança', 'crescimento'],
      replies: [],
      createdAt: new Date('2024-03-16T15:00:00')
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (selectedFilter) {
      case 'popular':
        return b.likes - a.likes;
      case 'unanswered':
        return a.replies.length - b.replies.length;
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nova postagem:', newPost);
    setNewPost({
      category: 'proposito',
      title: '',
      content: '',
      tags: ''
    });
  };

  const getCategoryIcon = (category: string) => {
    const cat = workCategories.find(c => c.value === category);
    return cat?.icon || '💼';
  };

  const getCategoryLabel = (category: string) => {
    const cat = workCategories.find(c => c.value === category);
    return cat?.label || 'Trabalho';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} dia${days > 1 ? 's' : ''} atrás`;
    if (hours > 0) return `${hours}h atrás`;
    return 'há pouco';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Block */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-xl p-6 shadow-sm">
        <p className="text-lg flex items-start gap-3">
          <span className="text-2xl">💼</span>
          <span className="text-gray-800">
            <strong>Compartilhe sua jornada profissional!</strong><br />
            Um espaço para discutir carreira, propósito, liderança feminina e os desafios 
            de ser mulher no mercado de trabalho. Juntas somos mais fortes!
          </span>
        </p>
      </div>

      {/* New Post Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-600">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>💡</span>
          Nova Discussão
        </h3>
        
        <form onSubmit={handleSubmitPost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {workCategories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setNewPost({...newPost, category: cat.value as any})}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    newPost.category === cat.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da discussão
            </label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              placeholder="Ex: Como negociar um aumento de salário?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compartilhe sua experiência ou dúvida
            </label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              rows={4}
              placeholder="Descreva sua situação, dúvida ou experiência profissional..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={newPost.tags}
              onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
              placeholder="Ex: liderança, transição de carreira, networking"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              💬 Publicar Discussão
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Categorias</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {workCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon} {cat.label.replace(/^[^\s]+ /, '')}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Ordenar por</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFilter('recent')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'recent'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Recentes
              </button>
              <button
                onClick={() => setSelectedFilter('popular')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'popular'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Populares
              </button>
              <button
                onClick={() => setSelectedFilter('unanswered')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'unanswered'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sem resposta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <span>💬</span>
          Discussões da Comunidade
        </h3>

        <div className="space-y-6">
          {sortedPosts.map((post) => (
            <div key={post.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {post.author.name}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {getCategoryIcon(post.category)} {getCategoryLabel(post.category).replace(/^[^\s]+ /, '')}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">
                    {post.title}
                  </h4>
                  
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {post.content}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-6 text-sm mb-4">
                <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                  <span>👍</span>
                  <span>{post.likes}</span>
                </button>
                
                <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                  <span>💬</span>
                  <span>{post.replies.length} respostas</span>
                </button>

                <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                  <span>🔖</span>
                  <span>Salvar</span>
                </button>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="ml-8 space-y-4">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          {reply.author.isFacilitator ? (
                            <span className="text-white text-xs">👩‍🏫</span>
                          ) : (
                            <span className="text-white text-xs font-semibold">
                              {reply.author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium ${
                              reply.author.isFacilitator ? 'text-blue-600' : 'text-gray-900'
                            }`}>
                              {reply.author.name}
                              {reply.author.isFacilitator && (
                                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full ml-2">
                                  Facilitadora
                                </span>
                              )}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {reply.content}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-2">
                            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors">
                              <span>👍</span>
                              <span>{reply.likes}</span>
                            </button>
                            <button className="text-xs text-gray-600 hover:text-blue-600 transition-colors">
                              💬 Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trabalho;