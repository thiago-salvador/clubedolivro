import React, { useState } from 'react';
import { 
  Video, 
  Music, 
  FileText, 
  X, 
  Check,
  AlertCircle,
  ExternalLink,
  Link2
} from 'lucide-react';
import { ContentType } from '../../types/admin.types';

interface ContentUploaderProps {
  type: ContentType;
  currentUrl?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

const ContentUploader: React.FC<ContentUploaderProps> = ({
  type,
  currentUrl = '',
  onChange,
  label,
  placeholder,
  helperText,
  required = false,
  disabled = false
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  // Get default values based on content type
  const getDefaults = () => {
    switch (type) {
      case ContentType.VIDEO:
        return {
          icon: Video,
          defaultLabel: 'URL do Vídeo (Vimeo)',
          defaultPlaceholder: 'https://vimeo.com/123456789 ou https://player.vimeo.com/video/123456789',
          defaultHelper: 'Cole a URL do vídeo do Vimeo. Aceita links do Vimeo ou do player embed.'
        };
      case ContentType.AUDIO:
        return {
          icon: Music,
          defaultLabel: 'URL do Áudio/Podcast',
          defaultPlaceholder: 'https://exemplo.com/audio.mp3 ou https://soundcloud.com/...',
          defaultHelper: 'Aceita arquivos de áudio (.mp3, .wav, etc.) ou links do SoundCloud/Spotify.'
        };
      default:
        return {
          icon: FileText,
          defaultLabel: 'URL do Conteúdo',
          defaultPlaceholder: 'https://exemplo.com/conteudo',
          defaultHelper: 'Cole a URL do conteúdo.'
        };
    }
  };

  const defaults = getDefaults();
  const Icon = defaults.icon;

  // Validate Vimeo URL
  const validateVimeoUrl = (urlToValidate: string): { isValid: boolean; error?: string } => {
    if (!urlToValidate.trim()) {
      return { isValid: false, error: 'URL é obrigatória' };
    }

    try {
      new URL(urlToValidate);
      
      // Check if it's a Vimeo URL
      const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
      const match = urlToValidate.match(vimeoRegex);
      
      if (!match) {
        return { 
          isValid: false, 
          error: 'URL inválida. Use um link do Vimeo (ex: vimeo.com/123456789)' 
        };
      }

      // Extract video ID
      const videoId = match[4];
      if (!videoId) {
        return { 
          isValid: false, 
          error: 'ID do vídeo não encontrado na URL' 
        };
      }

      
      return { isValid: true };
    } catch (error) {
      return { 
        isValid: false, 
        error: 'URL inválida. Verifique o formato.' 
      };
    }
  };

  // Validate audio URL
  const validateAudioUrl = (urlToValidate: string): { isValid: boolean; error?: string } => {
    if (!urlToValidate.trim()) {
      return { isValid: false, error: 'URL é obrigatória' };
    }

    try {
      const url = new URL(urlToValidate);
      
      // Check if it's a valid audio URL
      const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
      const soundcloudRegex = /^(https?:\/\/)?(www\.)?(soundcloud\.com\/)/;
      const spotifyRegex = /^(https?:\/\/)?(open\.)?spotify\.com\/(track|episode|show)\//;
      
      const hasAudioExtension = audioExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
      const isSoundcloud = soundcloudRegex.test(urlToValidate);
      const isSpotify = spotifyRegex.test(urlToValidate);
      
      if (!hasAudioExtension && !isSoundcloud && !isSpotify) {
        return { 
          isValid: false, 
          error: 'URL deve ser um arquivo de áudio (.mp3, .wav, etc.) ou de plataformas como SoundCloud/Spotify' 
        };
      }
      
      return { isValid: true };
    } catch (error) {
      return { 
        isValid: false, 
        error: 'URL inválida. Verifique o formato.' 
      };
    }
  };

  // Validate generic URL
  const validateGenericUrl = (urlToValidate: string): { isValid: boolean; error?: string } => {
    if (!urlToValidate.trim()) {
      return { isValid: false, error: 'URL é obrigatória' };
    }

    try {
      new URL(urlToValidate);
      return { isValid: true };
    } catch (error) {
      return { 
        isValid: false, 
        error: 'URL inválida. Verifique o formato.' 
      };
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setValidationError(null);
    setIsValid(false);
  };

  const handleValidate = async () => {
    if (!url.trim()) {
      setValidationError(required ? 'URL é obrigatória' : null);
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    // Simulate async validation (in real app, might check if URL is accessible)
    await new Promise(resolve => setTimeout(resolve, 500));

    const validation = type === ContentType.VIDEO 
      ? validateVimeoUrl(url)
      : type === ContentType.AUDIO
        ? validateAudioUrl(url)
        : validateGenericUrl(url);

    if (validation.isValid) {
      setIsValid(true);
      // For Vimeo, normalize the URL
      if (type === ContentType.VIDEO) {
        const vimeoRegex = /(\d+)/;
        const match = url.match(vimeoRegex);
        if (match) {
          const normalizedUrl = `https://player.vimeo.com/video/${match[1]}`;
          setUrl(normalizedUrl);
          onChange(normalizedUrl);
        }
      } else {
        onChange(url);
      }
    } else {
      setValidationError(validation.error || 'URL inválida');
      setIsValid(false);
    }

    setIsValidating(false);
  };

  const handleClear = () => {
    setUrl('');
    setValidationError(null);
    setIsValid(false);
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        <Icon className="w-4 h-4 inline mr-1" />
        {label || defaults.defaultLabel}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type="url"
          value={url}
          onChange={handleUrlChange}
          onBlur={handleValidate}
          placeholder={placeholder || defaults.defaultPlaceholder}
          className={`
            w-full pl-10 pr-24 py-2 border rounded-lg 
            focus:ring-2 focus:ring-terracota focus:border-transparent 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            ${validationError 
              ? 'border-red-500' 
              : isValid 
                ? 'border-green-500' 
                : 'border-gray-300 dark:border-gray-600'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={disabled}
        />
        
        <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {isValidating && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-terracota"></div>
          )}
          
          {!isValidating && isValid && (
            <Check className="w-4 h-4 text-green-500" />
          )}
          
          {!isValidating && validationError && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          
          {url && !isValidating && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              disabled={disabled}
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          )}
          
          {isValid && type === ContentType.VIDEO && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              title="Abrir em nova aba"
            >
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </a>
          )}
        </div>
      </div>
      
      {(helperText || defaults.defaultHelper) && !validationError && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {helperText || defaults.defaultHelper}
        </p>
      )}
      
      {validationError && (
        <p className="text-xs text-red-500">
          {validationError}
        </p>
      )}
      
      {type === ContentType.VIDEO && url && isValid && (
        <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <iframe
            src={`${url}?badge=0&autopause=0&player_id=0&app_id=58479`}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Vimeo video preview"
          ></iframe>
        </div>
      )}
      
      {type === ContentType.AUDIO && url && isValid && (
        <div className="mt-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
          {/* Direct audio file */}
          {(url.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) && (
            <audio 
              controls 
              className="w-full"
              preload="metadata"
            >
              <source src={url} />
              Seu navegador não suporta o elemento de áudio.
            </audio>
          )}
          
          {/* SoundCloud embed */}
          {url.includes('soundcloud.com') && (
            <div className="bg-white dark:bg-gray-700 rounded p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Music className="w-4 h-4 inline mr-1" />
                Player do SoundCloud será exibido aqui
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Nota: A incorporação do SoundCloud requer configuração adicional
              </p>
            </div>
          )}
          
          {/* Spotify embed */}
          {url.includes('spotify.com') && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded p-4">
              <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                <Music className="w-4 h-4 inline mr-1" />
                Player do Spotify será exibido aqui
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Nota: A incorporação do Spotify requer configuração adicional
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentUploader;