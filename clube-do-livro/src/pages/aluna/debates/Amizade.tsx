import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface FriendshipPost {
  id: string;
  theme: 'conexao' | 'limites' | 'toxica' | 'distancia' | 'nova' | 'perdas';
  title: string;
  content: string;
  isAnonymous: boolean;
  author: {
    name: string;
    avatar?: string;
  };
  likes: number;
  hugs: number;
  replies: FriendshipReply[];
  createdAt: Date;
  tags?: string[];
}

interface FriendshipReply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    isFacilitator?: boolean;
  };
  likes: number;
  createdAt: Date;
  isAnonymous?: boolean;
}

const Amizade: React.FC = () => {
  const { user } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [newPost, setNewPost] = useState({
    theme: 'conexao',
    title: '',
    content: '',
    isAnonymous: false,
    tags: ''
  });

  const friendshipThemes = [
    { value: 'conexao', label: '🤝 Conexões Verdadeiras', icon: '🤝' },
    { value: 'limites', label: '🚧 Limites Saudáveis', icon: '🚧' },
    { value: 'toxica', label: '⚠️ Amizades Tóxicas', icon: '⚠️' },
    { value: 'distancia', label: '🌍 Amizades à Distância', icon: '🌍' },
    { value: 'nova', label: '✨ Novas Amizades', icon: '✨' },
    { value: 'perdas', label: '💔 Rompimentos', icon: '💔' }
  ];

  const posts: FriendshipPost[] = [
    {
      id: '1',
      theme: 'toxica',
      title: 'Reconhecendo que minha melhor amiga era tóxica',
      content: 'Depois de ler sobre a "amiga demais" no livro, percebi que minha amiga de infância sempre diminuía minhas conquistas. Foi doloroso, mas necessário me afastar. Alguém mais passou por isso?',
      isAnonymous: true,
      author: { name: 'Anônima' },
      likes: 42,
      hugs: 38,
      tags: ['toxicidade', 'autopreservação', 'limites'],
      replies: [
        {
          id: '1-1',
          content: 'Passei exatamente por isso! O livro me ajudou a entender que não era egoísmo me proteger. Força para você! 💜',
          author: { name: 'Marina L.' },
          likes: 15,
          createdAt: new Date('2024-03-20T14:30:00'),
          isAnonymous: false
        },
        {
          id: '1-2',
          content: 'Reconhecer padrões tóxicos em amizades antigas é um ato de coragem e amor próprio. Vocês estão no caminho certo ao priorizar seu bem-estar emocional.',
          author: { name: 'Manu Xavier', isFacilitator: true },
          likes: 32,
          createdAt: new Date('2024-03-20T15:00:00')
        }
      ],
      createdAt: new Date('2024-03-20T10:00:00')
    },
    {
      id: '2',
      theme: 'conexao',
      title: 'Encontrei minha tribo aos 45 anos!',
      content: 'Sempre me senti deslocada até encontrar um grupo de mulheres que também estão lendo o livro. Finalmente tenho amigas que me entendem e com quem posso ser vulnerável. Nunca é tarde para encontrar sua tribo!',
      isAnonymous: false,
      author: { name: 'Claudia Santos' },
      likes: 78,
      hugs: 65,
      tags: ['tribo', 'conexão', 'vulnerabilidade'],
      replies: [
        {
          id: '2-1',
          content: 'Que lindo! Também encontrei minha tribo através do livro. É transformador ter amigas que vibram com nosso crescimento! 🌟',
          author: { name: 'Renata M.' },
          likes: 23,
          createdAt: new Date('2024-03-19T16:30:00')
        }
      ],
      createdAt: new Date('2024-03-19T14:00:00')
    },
    {
      id: '3',
      theme: 'limites',
      title: 'Como dizer não sem perder a amizade?',
      content: 'Tenho uma amiga que sempre pede favores e eu sempre digo sim, mesmo quando não posso. Estou aprendendo sobre limites, mas tenho medo de perdê-la se começar a dizer não. Dicas?',
      isAnonymous: false,
      author: { name: 'Beatriz Oliveira' },
      likes: 34,
      hugs: 28,
      tags: ['limites', 'assertividade', 'medo'],
      replies: [
        {
          id: '3-1',
          content: 'Uma amizade verdadeira sobrevive aos seus "nãos". Se ela se afastar por isso, talvez não fosse tão amiga assim. 💪',
          author: { name: 'Anônima' },
          likes: 19,
          createdAt: new Date('2024-03-18T11:30:00'),
          isAnonymous: true
        }
      ],
      createdAt: new Date('2024-03-18T09:00:00')
    },
    {
      id: '4',
      theme: 'distancia',
      title: 'Mantendo amizades depois da mudança',
      content: 'Me mudei de cidade por causa do trabalho e sinto falta das minhas amigas. Como manter a conexão à distância? O capítulo sobre a mulher que corre com os lobos me fez valorizar ainda mais essas conexões.',
      isAnonymous: false,
      author: { name: 'Patricia Lima' },
      likes: 26,
      hugs: 22,
      tags: ['distância', 'saudade', 'conexão'],
      replies: [],
      createdAt: new Date('2024-03-17T15:00:00')
    },
    {
      id: '5',
      theme: 'nova',
      title: 'Fazer amigas depois dos 30 é possível?',
      content: 'Sempre ouvi que é difícil fazer amizades verdadeiras depois de certa idade. Mas o livro me inspirou a me abrir mais. Onde vocês conheceram suas amigas adultas?',
      isAnonymous: false,
      author: { name: 'Juliana Costa' },
      likes: 45,
      hugs: 31,
      tags: ['novas amizades', 'idade', 'abertura'],
      replies: [
        {
          id: '5-1',
          content: 'Conheci minhas melhores amigas em um clube de leitura aos 35! Procure atividades que você gosta, a conexão vem naturalmente.',
          author: { name: 'Fernanda R.' },
          likes: 12,
          createdAt: new Date('2024-03-16T18:00:00')
        },
        {
          id: '5-2',
          content: 'Grupos de hobbies, voluntariado, cursos... São ótimos lugares! E este clube do livro também! 💕',
          author: { name: 'Ana Clara' },
          likes: 8,
          createdAt: new Date('2024-03-16T19:00:00')
        }
      ],
      createdAt: new Date('2024-03-16T14:00:00')
    },
    {
      id: '6',
      theme: 'perdas',
      title: 'O luto de uma amizade que acabou',
      content: 'Perdi uma amiga de 20 anos quando comecei minha jornada de autoconhecimento. Ela não entendeu minhas mudanças. Ainda dói muito. Como lidar com esse luto?',
      isAnonymous: true,
      author: { name: 'Anônima' },
      likes: 52,
      hugs: 48,
      tags: ['luto', 'transformação', 'dor'],
      replies: [
        {
          id: '6-1',
          content: 'O luto por uma amizade é real e válido. Permita-se sentir, chorar e aos poucos, agradecer pelo que foi bom. Enviando abraços! 🤗',
          author: { name: 'Carla Mendes' },
          likes: 24,
          createdAt: new Date('2024-03-15T10:00:00')
        }
      ],
      createdAt: new Date('2024-03-15T08:00:00')
    }
  ];

  const filteredPosts = selectedTheme === 'all' 
    ? posts 
    : posts.filter(post => post.theme === selectedTheme);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nova postagem:', newPost);
    setNewPost({
      theme: 'conexao',
      title: '',
      content: '',
      isAnonymous: false,
      tags: ''
    });
  };

  const handleHug = (postId: string) => {
    console.log('Enviando abraço para:', postId);
  };

  const getThemeIcon = (theme: string) => {
    const themeConfig = friendshipThemes.find(t => t.value === theme);
    return themeConfig?.icon || '👭';
  };

  const getThemeLabel = (theme: string) => {
    const themeConfig = friendshipThemes.find(t => t.value === theme);
    return themeConfig?.label || 'Amizade';
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
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-xl p-6 shadow-sm">
        <p className="text-lg flex items-start gap-3">
          <span className="text-2xl">👭</span>
          <span className="text-gray-800">
            <strong>Celebre e reflita sobre amizades!</strong><br />
            Um espaço acolhedor para compartilhar experiências sobre amizades femininas, 
            conexões verdadeiras, desafios e aprendizados. Aqui, toda história importa.
          </span>
        </p>
      </div>

      {/* New Post Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-600">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>💜</span>
          Compartilhar História
        </h3>
        
        <form onSubmit={handleSubmitPost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {friendshipThemes.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => setNewPost({...newPost, theme: theme.value as any})}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    newPost.theme === theme.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da sua história
            </label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              placeholder="Ex: Como superei a solidão e encontrei amigas verdadeiras"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conte sua experiência
            </label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              rows={4}
              placeholder="Compartilhe sua história, reflexões, dúvidas ou aprendizados sobre amizades..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (opcional, separadas por vírgula)
            </label>
            <input
              type="text"
              value={newPost.tags}
              onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
              placeholder="Ex: amizade verdadeira, limites, crescimento"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newPost.isAnonymous}
                onChange={(e) => setNewPost({...newPost, isAnonymous: e.target.checked})}
                className="rounded text-purple-600 focus:ring-purple-600"
              />
              <span className="text-sm text-gray-700">🔒 Publicar anonimamente</span>
            </label>
            
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              💭 Publicar História
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Filtrar por tema</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTheme('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTheme === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos os temas
          </button>
          {friendshipThemes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => setSelectedTheme(theme.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTheme === theme.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <span>💭</span>
          Histórias da Comunidade
        </h3>

        <div className="space-y-8">
          {filteredPosts.map((post) => (
            <div key={post.id} className="border-b border-gray-100 last:border-b-0 pb-8 last:pb-0">
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  {post.isAnonymous ? (
                    <span className="text-gray-500">👤</span>
                  ) : (
                    <span className="text-sm font-semibold text-purple-600">
                      {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {post.isAnonymous ? 'Anônima' : post.author.name}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {getThemeIcon(post.theme)} {getThemeLabel(post.theme).replace(/^[^\s]+ /, '')}
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
                        <span key={index} className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-6 text-sm mb-4">
                <button className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors">
                  <span>💜</span>
                  <span>{post.likes}</span>
                </button>
                
                <button
                  onClick={() => handleHug(post.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <span>🤗</span>
                  <span>Abraços ({post.hugs})</span>
                </button>
                
                <button className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors">
                  <span>💬</span>
                  <span>{post.replies.length} respostas</span>
                </button>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="ml-8 space-y-4">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          {reply.author.isFacilitator ? (
                            <span className="text-white text-xs">👩‍⚕️</span>
                          ) : reply.isAnonymous ? (
                            <span className="text-white text-xs">👤</span>
                          ) : (
                            <span className="text-white text-xs font-semibold">
                              {reply.author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium ${
                              reply.author.isFacilitator ? 'text-purple-600' : 'text-gray-900'
                            }`}>
                              {reply.isAnonymous ? 'Anônima' : reply.author.name}
                              {reply.author.isFacilitator && (
                                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full ml-2">
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
                            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-purple-600 transition-colors">
                              <span>💜</span>
                              <span>{reply.likes}</span>
                            </button>
                            <button className="text-xs text-gray-600 hover:text-purple-600 transition-colors">
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

export default Amizade;