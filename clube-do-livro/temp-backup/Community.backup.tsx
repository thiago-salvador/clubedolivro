import React, { useState, useEffect } from 'react';
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
  const [lastVisit, setLastVisit] = useState<Date>(() => {
    const saved = localStorage.getItem('community_last_visit');
    return saved ? new Date(saved) : new Date();
  });
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
      createdAt: new Date('2024-03-20'),
      reactions: {
        '❤️': ['3', '4', '5'],
        '🔥': ['4', '6'],
        '👏': ['3', '5', '6', '7']
      }
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
      createdAt: new Date('2024-03-19'),
      reactions: {
        '🤔': ['2', '5'],
        '💡': ['6']
      }
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
      createdAt: new Date('2024-03-19'),
      reactions: {
        '❤️': ['1', '2', '5', '6', '7', '8'],
        '🙏': ['2', '3', '5'],
        '✨': ['1', '4', '7']
      }
    }
  ]);

  // Filter posts by category
  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  // Community status
  const communityEndDate = new Date('2024-04-30');
  const isActive = new Date() < communityEndDate;

  // Update last visit on component mount
  useEffect(() => {
    localStorage.setItem('community_last_visit', new Date().toISOString());
  }, []);

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

  const handleReaction = (postId: string, emoji: string) => {
    if (!user) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const reactions = { ...post.reactions } || {};
        const userReacted = reactions[emoji]?.includes(user.id);
        
        if (userReacted) {
          // Remove reaction
          reactions[emoji] = reactions[emoji].filter(id => id !== user.id);
          if (reactions[emoji].length === 0) {
            delete reactions[emoji];
          }
        } else {
          // Add reaction
          if (!reactions[emoji]) {
            reactions[emoji] = [];
          }
          reactions[emoji].push(user.id);
        }
        
        return { ...post, reactions };
      }
      return post;
    }));
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

      {/* Category Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-terracota text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas as Postagens
          </button>
          {categoryConfigs.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedCategory === cat.id ? cat.color : '',
                color: selectedCategory === cat.id ? 'white' : ''
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
        {selectedCategory !== 'all' && (
          <p className="text-sm text-gray-600 mt-2">
            Mostrando {filteredPosts.length} {filteredPosts.length === 1 ? 'postagem' : 'postagens'} em {getCategoryConfig(selectedCategory as PostCategory)?.label}
          </p>
        )}
      </div>

      {/* New Post Component */}
      {isActive && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
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
            <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm relative">
              {/* New post indicator */}
              {post.createdAt > lastVisit && (
                <div className="absolute -top-2 -right-2 bg-terracota text-white text-xs px-2 py-1 rounded-full font-medium">
                  Novo
                </div>
              )}
              
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
                    <span className="text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      {format(post.createdAt, "d 'de' MMMM", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">"{post.content}"</p>
                  
                  {/* Reactions */}
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    {/* Reaction buttons */}
                    <div className="flex items-center gap-1">
                      {['❤️', '👏', '🔥', '💡', '🤔', '🙏', '✨'].map(emoji => {
                        const reactionCount = post.reactions?.[emoji]?.length || 0;
                        const userReacted = user && post.reactions?.[emoji]?.includes(user.id);
                        
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(post.id, emoji)}
                            className={`px-2 py-1 rounded-lg text-sm transition-all ${
                              reactionCount > 0
                                ? userReacted
                                  ? 'bg-terracota/20 border border-terracota'
                                  : 'bg-gray-100 hover:bg-gray-200'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                            title={`${reactionCount} reações`}
                          >
                            <span className="text-base">{emoji}</span>
                            {reactionCount > 0 && (
                              <span className="ml-1 text-xs font-medium">{reactionCount}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Like, Comment, Share buttons */}
                    <div className="flex items-center gap-3 ml-auto text-sm text-gray-500">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="hover:text-terracota transition-colors"
                      >
                        ❤️ {post.likes}
                      </button>
                      <button className="hover:text-terracota transition-colors">
                        💬 {post.comments.length}
                      </button>
                      <button className="hover:text-terracota transition-colors">
                        🔄 {post.shares}
                      </button>
                    </div>
                  </div>
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