import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Post, PostCategory } from '../../types';
import { categoryConfigs, getCategoryConfig } from '../../utils/categories';
import NewPostModal from '../../components/aluna/community/NewPostModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Community: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        id: '2',
        name: 'Ana Costa',
        email: 'ana@email.com',
        badges: [],
        joinedDate: new Date()
      },
      category: PostCategory.REFLEXAO,
      weekNumber: 5,
      content: 'Acabei de terminar o capítulo 3 e estou emocionada com as conexões que fiz com minha própria história. A parte sobre a mulher selvagem interior me tocou profundamente.',
      likes: 23,
      comments: [],
      shares: 5,
      isPinned: true,
      createdAt: new Date('2024-03-20')
    },
    {
      id: '2',
      author: {
        id: '3',
        name: 'Julia Santos',
        email: 'julia@email.com',
        badges: [],
        joinedDate: new Date()
      },
      category: PostCategory.DUVIDA,
      weekNumber: 5,
      content: 'Alguém mais teve dificuldade para entender o conceito de "predador natural da psique" na página 45? Gostaria de discutir isso com vocês.',
      likes: 8,
      comments: [],
      shares: 2,
      isPinned: false,
      createdAt: new Date('2024-03-19')
    },
    {
      id: '3',
      author: {
        id: '4',
        name: 'Mariana Lima',
        email: 'mariana@email.com',
        badges: [],
        joinedDate: new Date()
      },
      category: PostCategory.INSIGHT,
      weekNumber: 4,
      content: 'Percebi uma conexão profunda entre este capítulo e minha relação com minha mãe. É incrível como o livro nos faz refletir sobre padrões geracionais.',
      likes: 45,
      comments: [],
      shares: 8,
      isPinned: false,
      createdAt: new Date('2024-03-19')
    }
  ]);

  // Filter posts by category
  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  // Community status
  const communityEndDate = new Date('2024-04-30');
  const isActive = new Date() < communityEndDate;

  const handleNewPost = (newPost: { category: PostCategory; weekNumber: number; content: string }) => {
    if (!user) return;

    const post: Post = {
      id: Date.now().toString(),
      author: user,
      category: newPost.category,
      weekNumber: newPost.weekNumber,
      content: newPost.content,
      likes: 0,
      comments: [],
      shares: 0,
      isPinned: false,
      createdAt: new Date()
    };

    setPosts([post, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Block */}
      <div className="bg-verde-oliva text-white rounded-xl p-6 shadow-sm">
        <p className="text-lg flex items-start gap-3">
          <span className="text-2xl">💬</span>
          <span>
            Bem-vinda à nossa comunidade! Este é um espaço seguro para compartilhar suas reflexões, 
            dúvidas e descobertas sobre a leitura. Lembre-se de ser respeitosa e acolhedora com 
            todas as participantes.
          </span>
        </p>
      </div>

      {/* New Post Component */}
      {isActive && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory === 'all' ? '' : selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as PostCategory | 'all')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
              >
                <option value="">Selecione</option>
                {categoryConfigs.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título (opcional)
              </label>
              <input
                type="text"
                placeholder="Digite um título para sua postagem"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
              />
            </div>
          </div>
          <div className="mb-4">
            <textarea
              rows={3}
              placeholder="Compartilhe seus pensamentos..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-gray-600 hover:text-terracota transition-colors">
              <span>📎</span>
              <span className="text-sm">Anexar</span>
            </button>
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="px-6 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
            >
              Publicar
            </button>
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="flex justify-center">
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {isActive ? '🟢 Comunidade Ativa' : '🔒 Somente Leitura'} até {format(communityEndDate, 'dd/MM/yyyy')}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const categoryConfig = getCategoryConfig(post.category);
          
          return (
            <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">👤</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{post.author.name}</span>
                    <span className="text-gray-500">•</span>
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ 
                        backgroundColor: `${categoryConfig?.color}20`,
                        color: categoryConfig?.color 
                      }}
                    >
                      {categoryConfig?.label}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">"{post.content}"</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Post Modal */}
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSubmit={handleNewPost}
        currentWeek={5}
      />
    </div>
  );
};

export default Community;