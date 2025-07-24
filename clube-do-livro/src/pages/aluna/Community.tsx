import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Post, PostCategory, UserRole } from '../../types';
import { categoryConfigs, getCategoryConfig } from '../../utils/categories';
import NewPostModal from '../../components/aluna/community/NewPostModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { notificationService } from '../../services/notification.service';

// Skeleton loading component
const PostSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 bg-gray-200 rounded w-12"></div>
          <div className="h-8 bg-gray-200 rounded w-12"></div>
          <div className="h-8 bg-gray-200 rounded w-12"></div>
          <div className="ml-auto flex gap-3">
            <div className="h-4 bg-gray-200 rounded w-8"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

type SortOption = 'recent' | 'popular' | 'noResponse';

const Community: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>(() => {
    const saved = localStorage.getItem('community_selected_category');
    return saved ? (saved as PostCategory | 'all') : 'all';
  });
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const saved = localStorage.getItem('community_sort_option');
    return saved ? (saved as SortOption) : 'recent';
  });
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [lastVisit, setLastVisit] = useState<Date>(() => {
    const saved = localStorage.getItem('community_last_visit');
    return saved ? new Date(saved) : new Date();
  });
  
  // Infinite scroll states
  const [displayedPosts, setDisplayedPosts] = useState(6); // Initially show 6 posts
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        id: '2',
        name: 'Ana Costa',
        email: 'ana@email.com',
        role: UserRole.ALUNA,
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
        role: UserRole.ALUNA,
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
        role: UserRole.ALUNA,
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
    },
    {
      id: '4',
      author: {
        id: '5',
        name: 'Carla Mendes',
        email: 'carla@email.com',
        role: UserRole.ALUNA,
        badges: [],
        joinedDate: new Date()
      },
      category: PostCategory.CELEBRACAO,
      weekNumber: 3,
      content: 'Consegui aplicar os ensinamentos do capítulo 2 em uma conversa difícil com minha irmã. Foi transformador! Obrigada por este espaço seguro.',
      likes: 32,
      comments: [],
      shares: 4,
      isPinned: false,
      createdAt: new Date('2024-03-18'),
      reactions: {
        '🎉': ['1', '2', '3'],
        '❤️': ['4', '6', '7'],
        '👏': ['2', '5', '8']
      }
    },
    {
      id: '5',
      author: {
        id: '6',
        name: 'Patricia Rocha',
        email: 'patricia@email.com',
        role: UserRole.ALUNA,
        badges: [],
        joinedDate: new Date()
      },
      category: PostCategory.REFLEXAO,
      weekNumber: 4,
      content: 'A metáfora da Loba me fez pensar muito sobre como eu me desconectei da minha própria natureza selvagem. Alguém mais se sentiu assim?',
      likes: 28,
      comments: [],
      shares: 6,
      isPinned: false,
      createdAt: new Date('2024-03-17'),
      reactions: {
        '🤔': ['1', '3', '5'],
        '💡': ['2', '4'],
        '🙏': ['6', '7', '8']
      }
    },
    {
      id: '6',
      author: {
        id: '7',
        name: 'Fernanda Silva',
        email: 'fernanda@email.com',
        role: UserRole.ALUNA,
        badges: [],
        joinedDate: new Date()
      },
      category: PostCategory.DUVIDA,
      weekNumber: 2,
      content: 'Estou tendo dificuldades para entender o conceito de "arquétipo da mulher selvagem". Alguém poderia me ajudar com uma explicação mais simples?',
      likes: 15,
      comments: [],
      shares: 1,
      isPinned: false,
      createdAt: new Date('2024-03-16'),
      reactions: {
        '🤗': ['1', '2', '4', '5'],
        '💡': ['3', '6']
      }
    },
    {
      id: '7',
      author: {
        id: '8',
        name: 'Beatriz Costa',
        email: 'beatriz@email.com',
        role: UserRole.ALUNA,
        badges: [],
        joinedDate: new Date()
      },
      category: PostCategory.INSIGHT,
      weekNumber: 5,
      content: 'O exercício da página 78 me trouxe uma memória da infância que eu havia esquecido completamente. É incrível como este livro nos reconecta conosco mesmas.',
      likes: 41,
      comments: [],
      shares: 7,
      isPinned: false,
      createdAt: new Date('2024-03-15'),
      reactions: {
        '✨': ['1', '2', '3', '4', '5'],
        '❤️': ['6', '7', '8'],
        '🙏': ['1', '3', '5', '7']
      }
    },
    {
      id: '8',
      author: {
        id: '9',
        name: 'Luciana Martins',
        email: 'luciana@email.com',
        role: UserRole.ALUNA,
        badges: [],
        joinedDate: new Date()
      },
      category: PostCategory.CELEBRACAO,
      weekNumber: 4,
      content: 'Quero compartilhar que consegui estabelecer um limite saudável no trabalho pela primeira vez! Os ensinamentos realmente funcionam.',
      likes: 56,
      comments: [],
      shares: 12,
      isPinned: false,
      createdAt: new Date('2024-03-14'),
      reactions: {
        '🎉': ['1', '2', '3', '4'],
        '💪': ['5', '6', '7', '8'],
        '👏': ['1', '3', '5', '7', '9']
      }
    }
  ]);

  // Filter posts by category and apply sorting
  const filteredAndSortedPosts = (() => {
    let filtered = selectedCategory === 'all' 
      ? posts 
      : posts.filter(post => post.category === selectedCategory);
    
    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.likes + b.comments.length) - (a.likes + a.comments.length));
        break;
      case 'noResponse':
        filtered = filtered.filter(post => post.comments.length === 0);
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }
    
    return filtered;
  })();

  // Get posts to display (with infinite scroll)
  const postsToDisplay = filteredAndSortedPosts.slice(0, displayedPosts);

  // Community status
  const communityEndDate = new Date('2024-04-30');
  const isActive = new Date() < communityEndDate;

  // Update displayed posts when category or sorting changes
  useEffect(() => {
    setDisplayedPosts(6);
    setHasMorePosts(filteredAndSortedPosts.length > 6);
  }, [selectedCategory, sortBy, filteredAndSortedPosts.length]);

  // Persist filter selections
  useEffect(() => {
    localStorage.setItem('community_selected_category', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem('community_sort_option', sortBy);
  }, [sortBy]);

  // Update last visit on component mount and simulate initial loading
  useEffect(() => {
    localStorage.setItem('community_last_visit', new Date().toISOString());
    
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Load more posts function
  const loadMorePosts = () => {
    if (isLoadingMore || !hasMorePosts) return;

    setIsLoadingMore(true);
    
    // Simulate loading delay (in real app, this would be API call)
    setTimeout(() => {
      const newDisplayedPosts = displayedPosts + 6;
      setDisplayedPosts(newDisplayedPosts);
      setHasMorePosts(newDisplayedPosts < filteredAndSortedPosts.length);
      setIsLoadingMore(false);
    }, 1000);
  };

  // Infinite scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedPosts, filteredAndSortedPosts.length, isLoadingMore, hasMorePosts]);

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
        
        {/* Sorting and Filter Info */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent text-sm"
            >
              <option value="recent">Mais Recente</option>
              <option value="popular">Mais Popular</option>
              <option value="noResponse">Sem Resposta</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            {selectedCategory !== 'all' ? (
              <span>
                {postsToDisplay.length} de {filteredAndSortedPosts.length} {filteredAndSortedPosts.length === 1 ? 'postagem' : 'postagens'} em {getCategoryConfig(selectedCategory as PostCategory)?.label}
                {sortBy === 'noResponse' && ' sem resposta'}
              </span>
            ) : (
              <span>
                {postsToDisplay.length} de {filteredAndSortedPosts.length} {filteredAndSortedPosts.length === 1 ? 'postagem' : 'postagens'}
                {sortBy === 'noResponse' && ' sem resposta'}
              </span>
            )}
            <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
              {sortBy === 'recent' && '🕒 Recentes'}
              {sortBy === 'popular' && '🔥 Populares'}
              {sortBy === 'noResponse' && '❓ Sem Resposta'}
            </span>
          </div>
        </div>
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
        {/* Show skeleton loading during initial load */}
        {isInitialLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <PostSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        ) : (
          postsToDisplay.map((post) => {
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
                  
                  {/* Image preview placeholder - would be populated from post data */}
                  {post.id === '1' && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=300&fit=crop&auto=format" 
                        alt="Imagem da postagem" 
                        className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => {
                          // Open image in modal - future implementation
                          console.log('Open image modal');
                        }}
                        loading="lazy"
                      />
                    </div>
                  )}
                  
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
          })
        )}
        
        {/* Loading indicator and Load More button */}
        {!isInitialLoading && (
          <>
            {isLoadingMore && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-terracota"></div>
                  <span>Carregando mais postagens...</span>
                </div>
              </div>
            )}
            
            {!isLoadingMore && hasMorePosts && (
              <div className="flex justify-center py-6">
                <button
                  onClick={loadMorePosts}
                  className="px-6 py-3 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors flex items-center gap-2"
                >
                  <span>Ver mais postagens</span>
                  <span className="text-sm opacity-75">({filteredAndSortedPosts.length - postsToDisplay.length} restantes)</span>
                </button>
              </div>
            )}
            
            {!hasMorePosts && postsToDisplay.length > 6 && (
              <div className="flex justify-center py-6">
                <div className="text-gray-500 text-sm">
                  ✨ Você viu todas as postagens disponíveis
                </div>
              </div>
            )}
          </>
        )}
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