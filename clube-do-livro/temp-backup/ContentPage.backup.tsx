import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PodcastPlayer from '../../../components/aluna/aulas/PodcastPlayer';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  url: string;
}

const ContentPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [contentType, setContentType] = useState<'video' | 'podcast'>('video');
  const [currentVideoId, setCurrentVideoId] = useState('1');
  const [showPodcastPlayer, setShowPodcastPlayer] = useState(false);

  const videos: Video[] = [
    {
      id: '1',
      title: 'Introdução ao Capítulo - A Mulher Selvagem',
      thumbnail: '/images/video1-thumb.jpg',
      duration: '15:30',
      url: 'https://example.com/video1.mp4'
    },
    {
      id: '2',
      title: 'Análise Profunda - Arquétipos Femininos',
      thumbnail: '/images/video2-thumb.jpg',
      duration: '22:45',
      url: 'https://example.com/video2.mp4'
    },
    {
      id: '3',
      title: 'Reflexões e Aplicações Práticas',
      thumbnail: '/images/video3-thumb.jpg',
      duration: '18:20',
      url: 'https://example.com/video3.mp4'
    }
  ];

  const currentVideo = videos.find(v => v.id === currentVideoId) || videos[0];

  const handleContentTypeChange = (type: 'video' | 'podcast') => {
    setContentType(type);
    if (type === 'podcast') {
      setShowPodcastPlayer(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with Toggle */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Vídeo Aula - Capítulo {chapterId}
        </h1>
        
        {/* Content Type Toggle */}
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => handleContentTypeChange('video')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              contentType === 'video'
                ? 'bg-white text-terracota shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📹 Vídeo
          </button>
          <button
            onClick={() => handleContentTypeChange('podcast')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              contentType === 'podcast'
                ? 'bg-white text-terracota shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🎧 Podcast
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="bg-black rounded-xl overflow-hidden aspect-video">
            <video
              controls
              className="w-full h-full"
              poster={currentVideo.thumbnail}
              src={currentVideo.url}
            >
              Seu navegador não suporta a reprodução de vídeo.
            </video>
          </div>
          
          {/* Video Info */}
          <div className="mt-4 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {currentVideo.title}
            </h2>
            <p className="text-gray-600">
              Uma análise profunda sobre os conceitos apresentados neste capítulo, 
              explorando os arquétipos femininos e sua relação com nossa jornada de autodescoberta.
            </p>
          </div>
        </div>

        {/* Video List */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">
            Vídeos de Análise do Capítulo
          </h3>
          
          <div className="space-y-3">
            {videos.map((video) => {
              const isActive = video.id === currentVideoId;
              
              return (
                <button
                  key={video.id}
                  onClick={() => setCurrentVideoId(video.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-terracota/10 border border-terracota'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-24 h-16 bg-gray-200 rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      {isActive ? (
                        <span className="text-white text-2xl">▶️</span>
                      ) : (
                        <span className="text-white/70 text-xl">○</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Video Info */}
                  <div className="flex-1 text-left">
                    <h4 className={`font-medium ${
                      isActive ? 'text-terracota' : 'text-gray-900'
                    }`}>
                      {video.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {video.duration}
                    </p>
                    {isActive && (
                      <p className="text-xs text-terracota mt-1">
                        Assistindo agora
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Podcast Player Modal */}
      {showPodcastPlayer && (
        <PodcastPlayer
          isOpen={showPodcastPlayer}
          onClose={() => setShowPodcastPlayer(false)}
          episode={{
            title: currentVideo.title,
            coverImage: '/images/podcast-cover.jpg',
            audioUrl: 'https://example.com/audio.mp3',
            duration: currentVideo.duration
          }}
        />
      )}
    </div>
  );
};

export default ContentPage;