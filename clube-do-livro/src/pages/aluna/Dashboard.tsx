import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, BookOpenIcon, UsersIcon, TrendingUpIcon, SettingsIcon } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';
import { Post, PostCategory, UserRole } from '../../types';
import { getCategoryConfig } from '../../utils/categories';
import NewPostModal from '../../components/aluna/community/NewPostModal';
import { useReadingProgress } from '../../services/reading-progress.service';
import { notificationService } from '../../services/notification.service';
import { useSatisfactionSurvey } from '../../components/ui/SatisfactionSurvey';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedManualPost, setSelectedManualPost] = useState<Post | null>(null);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const { getLastLocation, getProgressStats } = useReadingProgress();
  const { SurveyComponent } = useSatisfactionSurvey();

  // Dados de progresso reais
  const progressStats = getProgressStats();
  const lastLocation = getLastLocation();
  const progress = progressStats.progressPercentage;
  
  // Data do próximo encontro (25/03 às 19:30)
  const nextMeetingDate = new Date('2024-03-25T19:30:00');

  // Agendar lembretes de encontro automaticamente
  useEffect(() => {
    if (user && nextMeetingDate > new Date()) {
      // Agendar lembrete 24h antes
      notificationService.scheduleMeeting24hReminder({
        userId: user.id,
        meetingId: 'meeting_semana5',
        meetingTitle: 'Encontro Online - Semana 5',
        meetingDate: nextMeetingDate,
        meetingTime: '19:30',
        meetingLocation: 'Plataforma Online',
        chapterTitle: 'Capítulo 5 - Transformação',
        userName: user.name
      });

      // Agendar lembrete 1h antes
      notificationService.scheduleMeeting1hReminder({
        userId: user.id,
        meetingId: 'meeting_semana5',
        meetingTitle: 'Encontro Online - Semana 5',
        meetingDate: nextMeetingDate,
        meetingTime: '19:30',
        meetingLocation: 'Plataforma Online',
        meetingLink: 'https://meet.google.com/example-link',
        userName: user.name
      });
    }
  }, [user, nextMeetingDate]);

  // Posts simulados da comunidade (normalmente viriam do banco)
  const communityPosts: Post[] = [
    {
      id: '1',
      author: { id: '1', name: 'Ana Costa', email: 'ana@email.com', role: UserRole.ALUNA, badges: [], joinedDate: new Date() },
      category: PostCategory.REFLEXAO,
      weekNumber: 5,
      content: 'O capítulo sobre La Loba me fez refletir profundamente sobre minha jornada de autoconhecimento.',
      likes: 67,
      comments: [],
      shares: 12,
      isPinned: false,
      createdAt: new Date('2024-03-15') // 7 dias atrás
    },
    {
      id: '2',
      author: { id: '2', name: 'Julia Santos', email: 'julia@email.com', role: UserRole.ALUNA, badges: [], joinedDate: new Date() },
      category: PostCategory.INSIGHT,
      weekNumber: 4,
      content: 'Percebi uma conexão profunda entre este capítulo e minha relação com minha mãe. Foi um momento de grande clareza e cura interior.',
      likes: 45,
      comments: [],
      shares: 8,
      isPinned: false,
      createdAt: new Date('2024-03-16') // 6 dias atrás
    },
    {
      id: '3',
      author: { id: '3', name: 'Maria Oliveira', email: 'maria@email.com', role: UserRole.ALUNA, badges: [], joinedDate: new Date() },
      category: PostCategory.DUVIDA,
      weekNumber: 3,
      content: 'Estou tendo dificuldades para conectar com minha criança interior. Alguém tem dicas?',
      likes: 32,
      comments: [],
      shares: 3,
      isPinned: false,
      createdAt: new Date('2024-03-14') // 8 dias atrás
    },
    {
      id: '4',
      author: { id: '4', name: 'Carolina Silva', email: 'carolina@email.com', role: UserRole.ALUNA, badges: [], joinedDate: new Date() },
      category: PostCategory.CELEBRACAO,
      weekNumber: 5,
      content: 'Hoje consegui aplicar os ensinamentos sobre limites saudáveis em uma situação difícil no trabalho!',
      likes: 89,
      comments: [],
      shares: 15,
      isPinned: false,
      createdAt: new Date('2024-03-17') // 5 dias atrás
    }
  ];

  // Função para identificar o post da semana automaticamente
  const getPostOfTheWeek = (): Post => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Filtrar posts da semana anterior
    const lastWeekPosts = communityPosts.filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate >= oneWeekAgo && postDate <= new Date();
    });

    // Se não há posts da semana, usar o mais curtido de todos os tempos
    const postsToConsider = lastWeekPosts.length > 0 ? lastWeekPosts : communityPosts;

    // Ordenar por curtidas (decrescente) e retornar o primeiro
    const sortedPosts = postsToConsider.sort((a, b) => b.likes - a.likes);
    
    return sortedPosts[0] || communityPosts[0]; // fallback para o primeiro post
  };

  // Função para obter o post em destaque (automático ou manual)
  const getFeaturedPost = (): Post => {
    if (isManualOverride && selectedManualPost) {
      return selectedManualPost;
    }
    return getPostOfTheWeek();
  };

  const postOfTheWeek = getFeaturedPost();

  // Função para definir post manual
  const handleManualPostSelection = (post: Post) => {
    setSelectedManualPost(post);
    setIsManualOverride(true);
    setIsAdminModalOpen(false);
  };

  // Função para voltar ao automático
  const resetToAutomatic = () => {
    setIsManualOverride(false);
    setSelectedManualPost(null);
    setIsAdminModalOpen(false);
  };

  const upcomingActivities = [
    { date: '25/03', title: 'Encontro Online - Semana 5', type: 'meeting' },
    { date: '26/03', title: 'Entrega do Exercício Terapêutico', type: 'exercise' },
    { date: '28/03', title: 'Live com a Facilitadora', type: 'live' }
  ];

  // Calcular countdown
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const difference = nextMeetingDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        setCountdown({ days, hours, minutes });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, []);

  const handleNewPost = (newPost: { category: PostCategory; weekNumber: number; content: string }) => {
    // Aqui você pode adicionar a lógica para salvar o post
    // Por enquanto, vamos apenas fechar o modal e redirecionar para a comunidade
    setIsNewPostModalOpen(false);
    navigate('/aluna/comunidade');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-terracota to-marrom-escuro rounded-2xl p-8 text-white overflow-hidden" role="banner" aria-label="Seção de boas-vindas">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              Olá, {user?.name}! 👋
            </h1>
            <p className="text-lg text-white/95 mb-6">
              Pronta para continuar sua jornada?
            </p>
            <button 
              onClick={() => navigate(lastLocation.path)}
              className="bg-white text-terracota px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-white"
              title={`Capítulo ${lastLocation.chapterId} - ${lastLocation.contentType}`}
              aria-label={`Continuar leitura do Capítulo ${lastLocation.chapterId} - ${lastLocation.contentType}`}
            >
              <BookOpenIcon size={20} />
              Continuar de onde parou
            </button>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm text-white/90 mb-2">Você está no</p>
            <p className="text-4xl font-bold">Capítulo {progressStats.currentChapter}</p>
            <p className="text-sm text-white/90">de {progressStats.totalChapters}</p>
            <div className="mt-3">
              <p className="text-xs text-white/80">{progressStats.completedChapters} capítulos concluídos</p>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="region" aria-label="Estatísticas e informações do curso">
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-terracota/10 rounded-lg">
              <BookOpenIcon className="text-terracota" size={24} />
            </div>
            <span className="text-sm text-gray-600">Progresso</span>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-terracota to-marrom-escuro bg-clip-text text-transparent">Capítulo {progressStats.currentChapter}</p>
          <p className="text-sm text-gray-700">de {progressStats.totalChapters} capítulos</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progresso do curso: ${progress}% concluído`}>
            <div 
              className="bg-terracota rounded-full h-2 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-verde-oliva/10 rounded-lg">
              <UsersIcon className="text-verde-oliva" size={24} />
            </div>
            <span className="text-sm text-gray-600">Comunidade</span>
          </div>
          <p className="text-2xl font-bold text-verde-oliva">Ativa</p>
          <p className="text-sm text-gray-700">até 30/04/2024</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-dourado/10 rounded-lg">
              <CalendarIcon className="text-dourado" size={24} />
            </div>
            <span className="text-sm text-gray-600">Próximo Encontro</span>
          </div>
          <p className="text-2xl font-bold text-dourado">25/03</p>
          <p className="text-sm text-gray-700">19h30 - Online</p>
          <div className="mt-4 p-3 bg-dourado/10 rounded-lg">
            <p className="text-xs text-gray-700 font-medium">
              {countdown.days > 0 ? (
                <>Faltam {countdown.days} {countdown.days === 1 ? 'dia' : 'dias'}, {countdown.hours}h e {countdown.minutes}min</>
              ) : countdown.hours > 0 ? (
                <>Faltam {countdown.hours}h e {countdown.minutes}min</>
              ) : (
                <>Faltam {countdown.minutes}min</>
              )}
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Post da Semana */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="text-terracota" />
              Post em Destaque
            </div>
            {/* Botão Admin */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1 text-xs text-gray-600 hover:text-terracota border border-gray-300 hover:border-terracota rounded-lg transition-colors"
              title="Configurações de Admin"
            >
              <SettingsIcon size={14} />
              Admin
            </button>
          </h2>
          
          {/* Tag Post da Semana */}
          <div className="mb-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-dourado to-terracota text-white text-sm font-medium rounded-full">
              ⭐ Post da Semana
            </span>
            <span className="text-xs text-gray-500">
              {isManualOverride 
                ? `Selecionado manualmente - ${postOfTheWeek.likes} curtidas`
                : `Automaticamente selecionado - ${postOfTheWeek.likes} curtidas`
              }
            </span>
          </div>
          
          {/* Post Destacado */}
          <div className="border-2 border-dourado/30 rounded-xl p-6 bg-gradient-to-br from-dourado/5 to-transparent">
            {(() => {
              const categoryConfig = getCategoryConfig(postOfTheWeek.category);
              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terracota to-marrom-escuro flex items-center justify-center text-white font-semibold">
                        {postOfTheWeek.author.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{postOfTheWeek.author.name}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${categoryConfig?.color}20`,
                              color: categoryConfig?.color 
                            }}
                          >
                            {categoryConfig?.icon} {categoryConfig?.label}
                          </span>
                          <span className="text-gray-500">• Semana {postOfTheWeek.weekNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">{postOfTheWeek.content}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                    <button className="flex items-center gap-1 hover:text-terracota transition-colors">
                      <span className="text-lg">❤️</span>
                      <span className="font-medium">{postOfTheWeek.likes} curtidas</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-terracota transition-colors">
                      <span className="text-lg">💬</span>
                      <span className="font-medium">{postOfTheWeek.comments.length} comentários</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-terracota transition-colors">
                      <span className="text-lg">🔄</span>
                      <span className="font-medium">{postOfTheWeek.shares} compartilhamentos</span>
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
          
          {/* New Post Button */}
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-lg">➕</span>
              Nova publicação
            </button>
          </div>
        </div>

        {/* Upcoming Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="text-terracota" />
            Próximas Atividades
          </h2>
          <div className="space-y-3">
            {upcomingActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="text-center min-w-[50px]">
                  <p className="text-xs text-gray-500">Data</p>
                  <p className="font-semibold text-gray-900">{activity.date}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">
                    {activity.type === 'meeting' && '🎥 Encontro Online'}
                    {activity.type === 'exercise' && '✍️ Exercício'}
                    {activity.type === 'live' && '📺 Live'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* New Post Modal */}
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSubmit={handleNewPost}
        currentWeek={progressStats.currentChapter}
      />

      {/* Modal Admin para seleção manual do post */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Configurar Post em Destaque</h2>
                <button
                  onClick={() => setIsAdminModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Escolha um post para destacar manualmente ou volte ao modo automático
              </p>
            </div>

            <div className="p-6">
              {/* Opção Automática */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Seleção Automática</h3>
                    <p className="text-sm text-gray-600">
                      O post com mais curtidas da semana será selecionado automaticamente
                    </p>
                  </div>
                  <button
                    onClick={resetToAutomatic}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      !isManualOverride
                        ? 'bg-terracota text-white'
                        : 'border border-terracota text-terracota hover:bg-terracota hover:text-white'
                    }`}
                  >
                    {!isManualOverride ? 'Ativo' : 'Ativar'}
                  </button>
                </div>
              </div>

              {/* Lista de Posts */}
              <div>
                <h3 className="font-medium mb-4">Ou selecione um post manualmente:</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {communityPosts.map((post) => {
                    const categoryConfig = getCategoryConfig(post.category);
                    const isSelected = isManualOverride && selectedManualPost?.id === post.id;
                    
                    if (!categoryConfig) return null;
                    
                    return (
                      <div
                        key={post.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-terracota bg-terracota/5'
                            : 'border-gray-200 hover:border-terracota hover:bg-gray-50'
                        }`}
                        onClick={() => handleManualPostSelection(post)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm">{categoryConfig.icon}</span>
                              <span className="text-xs px-2 py-1 rounded-full" style={{ 
                                backgroundColor: categoryConfig.color + '20', 
                                color: categoryConfig.color 
                              }}>
                                {categoryConfig.label}
                              </span>
                              <span className="text-xs text-gray-500">
                                {post.author.name}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 line-clamp-2">
                              {post.content}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>❤️ {post.likes}</span>
                              <span>💬 {post.comments.length}</span>
                              <span>📤 {post.shares}</span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="text-terracota font-medium text-sm">
                              ✓ Selecionado
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Satisfaction Survey */}
      {SurveyComponent}
    </div>
  );
};

export default Dashboard;