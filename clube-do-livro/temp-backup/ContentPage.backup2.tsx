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

interface Podcast {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  audioUrl: string;
  description?: string;
}

const ContentPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [contentType, setContentType] = useState<'video' | 'podcast'>('video');
  const [currentVideoId, setCurrentVideoId] = useState('1');
  const [currentPodcastId, setCurrentPodcastId] = useState('1');
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

  const podcasts: Podcast[] = [
    {
      id: '1',
      title: 'Reflexões Iniciais - A Jornada Interior',
      thumbnail: '/images/podcast1-thumb.jpg',
      duration: '25:30',
      audioUrl: 'https://example.com/podcast1.mp3',
      description: 'Uma meditação guiada sobre os conceitos apresentados no capítulo, explorando nossa conexão com o feminino selvagem.'
    },
    {
      id: '2',
      title: 'Conversas Profundas - Despertando a Loba',
      thumbnail: '/images/podcast2-thumb.jpg',
      duration: '32:15',
      audioUrl: 'https://example.com/podcast2.mp3',
      description: 'Diálogo íntimo sobre como reconhecer e honrar nossa natureza instintiva.'
    },
    {
      id: '3',
      title: 'Integrando os Aprendizados',
      thumbnail: '/images/podcast3-thumb.jpg',
      duration: '28:45',
      audioUrl: 'https://example.com/podcast3.mp3',
      description: 'Como aplicar os ensinamentos deste capítulo em nossa vida cotidiana.'
    }
  ];

  const currentVideo = videos.find(v => v.id === currentVideoId) || videos[0];
  const currentPodcast = podcasts.find(p => p.id === currentPodcastId) || podcasts[0];

  const handleContentTypeChange = (type: 'video' | 'podcast') => {
    setContentType(type);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with Toggle */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {contentType === 'video' ? 'Vídeo Aula' : 'Podcast'} - Capítulo {chapterId}
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
        {/* Media Player */}
        <div className="lg:col-span-2">
          {contentType === 'video' ? (
            <>
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
            </>
          ) : (
            <>
              {/* Podcast Player */}
              <div className="bg-gradient-to-br from-terracota to-marrom-escuro rounded-xl overflow-hidden aspect-video relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-8xl">🎧</span>
                    </div>
                    <h3 className="text-white text-2xl font-bold mb-2">{currentPodcast.title}</h3>
                    <p className="text-white/80">{currentPodcast.duration}</p>
                    <button
                      onClick={() => setShowPodcastPlayer(true)}
                      className="mt-4 px-8 py-3 bg-white text-terracota rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                      ▶️ Reproduzir
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Podcast Info */}
              <div className="mt-4 bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentPodcast.title}
                </h2>
                <p className="text-gray-600">
                  {currentPodcast.description || 'Uma jornada sonora pelos caminhos do feminino selvagem.'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Media List */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">
            {contentType === 'video' ? 'Vídeos de Análise' : 'Episódios de Podcast'}
          </h3>
          
          <div className="space-y-3">
            {contentType === 'video' ? (
              videos.map((video) => {
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
              })
            ) : (
              podcasts.map((podcast) => {
                const isActive = podcast.id === currentPodcastId;
                
                return (
                  <button
                    key={podcast.id}
                    onClick={() => setCurrentPodcastId(podcast.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-terracota/10 border border-terracota'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-24 h-16 bg-gradient-to-br from-terracota to-marrom-escuro rounded-md overflow-hidden relative flex items-center justify-center">
                      <span className="text-white text-2xl">🎧</span>
                    </div>
                    
                    {/* Podcast Info */}
                    <div className="flex-1 text-left">
                      <h4 className={`font-medium ${
                        isActive ? 'text-terracota' : 'text-gray-900'
                      }`}>
                        {podcast.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {podcast.duration}
                      </p>
                      {isActive && (
                        <p className="text-xs text-terracota mt-1">
                          Ouvindo agora
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Podcast Player Modal */}
      {showPodcastPlayer && (
        <PodcastPlayer
          isOpen={showPodcastPlayer}
          onClose={() => setShowPodcastPlayer(false)}
          episode={{
            title: currentPodcast.title,
            coverImage: currentPodcast.thumbnail,
            audioUrl: currentPodcast.audioUrl,
            duration: currentPodcast.duration,
            thumbnail: currentPodcast.thumbnail
          }}
        />
      )}
    </div>
  );
};

export default ContentPage;