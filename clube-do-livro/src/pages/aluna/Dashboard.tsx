import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, BookOpenIcon, UsersIcon, TrendingUpIcon } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';
import { Post, PostCategory } from '../../types';
import { getCategoryConfig } from '../../utils/categories';
import NewPostModal from '../../components/aluna/community/NewPostModal';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // Mock data - substituir por dados reais
  const currentWeek = 5;
  const totalWeeks = 17;
  const progress = (currentWeek / totalWeeks) * 100;

  const trendingPosts: Post[] = [
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
      content: 'Acabei de terminar o capítulo 3 e estou emocionada com as conexões que fiz com minha própria história.',
      likes: 23,
      comments: [],
      shares: 5,
      isPinned: true,
      createdAt: new Date()
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
      category: PostCategory.INSIGHT,
      weekNumber: 4,
      content: 'Percebi uma conexão profunda entre este capítulo e minha relação com minha mãe.',
      likes: 45,
      comments: [],
      shares: 8,
      isPinned: false,
      createdAt: new Date()
    }
  ];

  const upcomingActivities = [
    { date: '25/03', title: 'Encontro Online - Semana 5', type: 'meeting' },
    { date: '26/03', title: 'Entrega do Exercício Terapêutico', type: 'exercise' },
    { date: '28/03', title: 'Live com a Facilitadora', type: 'live' }
  ];

  const handleNewPost = (newPost: { category: PostCategory; weekNumber: number; content: string }) => {
    // Aqui você pode adicionar a lógica para salvar o post
    // Por enquanto, vamos apenas fechar o modal e redirecionar para a comunidade
    setIsNewPostModalOpen(false);
    navigate('/aluna/comunidade');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-terracota to-marrom-escuro rounded-2xl p-8 text-white overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Olá, {user?.name}! 👋
          </h1>
          <p className="text-lg opacity-90">
            Bem-vinda de volta à sua jornada de autodescoberta
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <BookOpenIcon className="text-terracota" size={24} />
            <span className="text-sm text-gray-500">Progresso</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">Semana {currentWeek}</p>
          <p className="text-sm text-gray-600">de {totalWeeks} semanas</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-terracota rounded-full h-2 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <UsersIcon className="text-verde-oliva" size={24} />
            <span className="text-sm text-gray-500">Comunidade</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">Ativa</p>
          <p className="text-sm text-gray-600">até 30/04/2024</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <CalendarIcon className="text-dourado" size={24} />
            <span className="text-sm text-gray-500">Próximo Encontro</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">25/03</p>
          <p className="text-sm text-gray-600">19h30 - Online</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <TrendingUpIcon className="text-verde-floresta" size={24} />
            <span className="text-sm text-gray-500">Participação</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">85%</p>
          <p className="text-sm text-gray-600">Taxa de presença</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trending Posts */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUpIcon className="text-terracota" />
            Posts em Destaque
          </h2>
          <div className="space-y-4">
            {trendingPosts.map((post) => {
              const categoryConfig = getCategoryConfig(post.category);
              return (
                <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-terracota to-marrom-escuro flex items-center justify-center text-white font-semibold text-sm">
                        {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{post.author.name}</p>
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
                          <span className="text-gray-500">• Semana {post.weekNumber}</span>
                        </div>
                      </div>
                    </div>
                    {post.isPinned && <span className="text-terracota">📌</span>}
                  </div>
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <button className="hover:text-terracota">❤️ {post.likes}</button>
                    <button className="hover:text-terracota">💬 {post.comments.length}</button>
                    <button className="hover:text-terracota">🔄 {post.shares}</button>
                  </div>
                </div>
              );
            })}
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

      {/* Continue Reading Section */}
      <div className="bg-gradient-to-r from-verde-oliva to-verde-floresta rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Continue de onde parou</h2>
            <p className="opacity-90">Semana 5 - "A Mulher Selvagem como Arquétipo"</p>
          </div>
          <button className="bg-white text-verde-floresta px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Continuar Leitura
          </button>
        </div>
      </div>

      {/* New Post Modal */}
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSubmit={handleNewPost}
        currentWeek={currentWeek}
      />
    </div>
  );
};

export default Dashboard;