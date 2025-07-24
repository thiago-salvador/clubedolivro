import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpenIcon, UsersIcon } from '../../../components/Icons';

interface ContentCard {
  id: string;
  title: string;
  icon: string;
  thumbnail: string;
  route: string;
}

const ChapterOverview: React.FC = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams<{ chapterId: string }>();

  const contentCards: ContentCard[] = [
    {
      id: 'music',
      title: 'Música para embalar',
      icon: '🎵',
      thumbnail: '/images/music-thumb.jpg',
      route: `/aluna/aulas/capitulo/${chapterId}/musica`
    },
    {
      id: 'video',
      title: 'Vídeo Aula',
      icon: '📹',
      thumbnail: '/images/video-thumb.jpg',
      route: `/aluna/aulas/capitulo/${chapterId}/video`
    },
    {
      id: 'exercise',
      title: 'Exercício Terapêutico',
      icon: '✍️',
      thumbnail: '/images/exercise-thumb.jpg',
      route: `/aluna/aulas/capitulo/${chapterId}/exercicio`
    },
    {
      id: 'meetings',
      title: 'Encontros Participativos',
      icon: '💬',
      thumbnail: '/images/meetings-thumb.jpg',
      route: `/aluna/aulas/capitulo/${chapterId}/encontros`
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Capítulo {chapterId}
        </h1>
        <p className="text-lg text-gray-600">
          Selecione o tipo de conteúdo que deseja acessar
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contentCards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.route)}
            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-terracota"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-terracota/20 to-marrom-escuro/20 group-hover:opacity-0 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform">
                  {card.icon}
                </span>
              </div>
            </div>
            
            {/* Title */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-terracota transition-colors">
                {card.title}
              </h3>
            </div>
          </button>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Progresso do Capítulo</h3>
          <span className="text-sm text-gray-600">2 de 4 conteúdos concluídos</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-terracota rounded-full h-2" style={{ width: '50%' }} />
        </div>
      </div>
    </div>
  );
};

export default ChapterOverview;