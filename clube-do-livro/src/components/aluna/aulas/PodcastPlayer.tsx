import React, { useState, useRef, useEffect } from 'react';
import { XIcon } from '../../Icons';

interface PodcastPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  episode: {
    title: string;
    coverImage: string;
    audioUrl: string;
    duration: string;
    thumbnail?: string;
  };
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ isOpen, onClose, episode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  if (!isOpen) return null;

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const changePlaybackRate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    
    audio.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  const handleShare = async () => {
    // Implementação da funcionalidade de compartilhamento
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Escutando: ${episode.title}`,
          text: `Confira este episódio incrível do Clube do Livro!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para copiar link
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XIcon size={20} />
        </button>

        {/* Cover Image with Animated Equalizer */}
        <div className="mx-auto w-64 h-64 rounded-lg mb-6 relative overflow-hidden">
          {episode.thumbnail ? (
            <img 
              src={episode.thumbnail} 
              alt={episode.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-terracota to-marrom-escuro flex items-center justify-center">
              <span className="text-white text-6xl">🎧</span>
            </div>
          )}
          
          {/* Animated Equalizer Overlay */}
          {isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 flex items-center justify-center gap-1">
              <div className="w-1 bg-white animate-pulse" style={{ height: '20px', animationDelay: '0ms', animationDuration: '400ms' }}></div>
              <div className="w-1 bg-white animate-pulse" style={{ height: '30px', animationDelay: '100ms', animationDuration: '600ms' }}></div>
              <div className="w-1 bg-white animate-pulse" style={{ height: '25px', animationDelay: '200ms', animationDuration: '500ms' }}></div>
              <div className="w-1 bg-white animate-pulse" style={{ height: '35px', animationDelay: '300ms', animationDuration: '700ms' }}></div>
              <div className="w-1 bg-white animate-pulse" style={{ height: '28px', animationDelay: '400ms', animationDuration: '550ms' }}></div>
              <div className="w-1 bg-white animate-pulse" style={{ height: '32px', animationDelay: '500ms', animationDuration: '650ms' }}></div>
              <div className="w-1 bg-white animate-pulse" style={{ height: '24px', animationDelay: '600ms', animationDuration: '450ms' }}></div>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          UNLEASH YOUR POTENTIAL
        </h2>
        <p className="text-gray-600 text-center mb-6">{episode.title}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #D97706 0%, #D97706 ${(currentTime / duration) * 100}%, #E5E7EB ${(currentTime / duration) * 100}%, #E5E7EB 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => skipTime(-15)}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="text-2xl">⏮️</span>
          </button>
          <button
            onClick={togglePlayPause}
            className="p-4 bg-terracota hover:bg-marrom-escuro text-white rounded-full transition-colors"
          >
            <span className="text-3xl">{isPlaying ? '⏸️' : '▶️'}</span>
          </button>
          <button
            onClick={() => skipTime(15)}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="text-2xl">⏭️</span>
          </button>
        </div>

        {/* Playback Speed Control */}
        <div className="flex justify-center mb-6">
          <button
            onClick={changePlaybackRate}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors"
          >
            Velocidade: {playbackRate}x
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span>🔗</span>
          Compartilhar Tela
        </button>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={episode.audioUrl} />
      </div>
    </div>
  );
};

export default PodcastPlayer;