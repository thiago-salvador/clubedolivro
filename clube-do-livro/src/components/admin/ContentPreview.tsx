import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  Smartphone, 
  Monitor, 
  Play, 
  Volume2,
  FileText,
  Calendar,
  Clock,
  User,
  Tag,
  CheckCircle
} from 'lucide-react';
import { CourseContent, ContentType } from '../../types/admin.types';

interface ContentPreviewProps {
  content: CourseContent;
  courseName?: string;
  onClose: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const ContentPreview: React.FC<ContentPreviewProps> = ({
  content,
  courseName = 'Nome do Curso',
  onClose
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  const deviceConfigs = {
    desktop: { width: '100%', height: '100%', label: 'Desktop' },
    tablet: { width: '768px', height: '1024px', label: 'Tablet' },
    mobile: { width: '375px', height: '667px', label: 'Mobile' }
  };

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case ContentType.VIDEO:
        return <Play className="w-5 h-5" />;
      case ContentType.AUDIO:
        return <Volume2 className="w-5 h-5" />;
      case ContentType.TEXT:
        return <FileText className="w-5 h-5" />;
      case ContentType.EXERCISE:
        return <CheckCircle className="w-5 h-5" />;
      case ContentType.MEETING:
        return <Calendar className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getContentTypeLabel = (type: ContentType) => {
    const labels = {
      [ContentType.VIDEO]: 'Vídeo',
      [ContentType.AUDIO]: 'Áudio',
      [ContentType.TEXT]: 'Texto',
      [ContentType.EXERCISE]: 'Exercício',
      [ContentType.MEETING]: 'Encontro'
    };
    return labels[type] || 'Conteúdo';
  };

  const renderContentBody = () => {
    switch (content.type) {
      case ContentType.VIDEO:
        return (
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            {content.videoUrl ? (
              <iframe
                src={content.videoUrl}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title={content.title}
              />
            ) : (
              <div className="text-white text-center">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">Vídeo não disponível</p>
              </div>
            )}
          </div>
        );

      case ContentType.AUDIO:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8">
            <div className="max-w-md mx-auto">
              <Volume2 className="w-16 h-16 mx-auto mb-4 text-terracota" />
              <h3 className="text-lg font-medium text-center mb-4">{content.title}</h3>
              {content.audioUrl ? (
                <audio controls className="w-full">
                  <source src={content.audioUrl} />
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Áudio não disponível
                </p>
              )}
            </div>
          </div>
        );

      case ContentType.TEXT:
        return (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {content.textContent ? (
              <div dangerouslySetInnerHTML={{ __html: content.textContent }} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Conteúdo de texto não disponível
              </p>
            )}
          </div>
        );

      case ContentType.EXERCISE:
        return (
          <div className="space-y-6">
            {content.exerciseInstructions && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-blue-900 dark:text-blue-100 font-medium mb-2">
                  Instruções
                </h4>
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: content.exerciseInstructions }}
                />
              </div>
            )}
            
            {content.textContent && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: content.textContent }}
                />
              </div>
            )}

            {!content.exerciseInstructions && !content.textContent && (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Conteúdo do exercício não disponível
              </p>
            )}
          </div>
        );

      case ContentType.MEETING:
        return (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <div className="text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-terracota" />
              <h3 className="text-lg font-medium mb-2">{content.title}</h3>
              
              {content.scheduledDate && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {new Date(content.scheduledDate).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}

              {content.duration && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duração: {content.duration} minutos
                </p>
              )}

              {content.meetingUrl && (
                <a
                  href={content.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors"
                >
                  Acessar Encontro
                </a>
              )}
            </div>
          </div>
        );

      default:
        return (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Tipo de conteúdo não suportado
          </p>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Preview do Conteúdo
            </h2>
            {/* Device Selector */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => setDeviceType('desktop')}
                className={`p-2 rounded ${
                  deviceType === 'desktop'
                    ? 'bg-terracota text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Desktop"
              >
                <Monitor className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDeviceType('tablet')}
                className={`p-2 rounded ${
                  deviceType === 'tablet'
                    ? 'bg-terracota text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Tablet"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2"/>
                  <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button
                onClick={() => setDeviceType('mobile')}
                className={`p-2 rounded ${
                  deviceType === 'mobile'
                    ? 'bg-terracota text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Mobile"
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900 p-6">
          <div 
            className="mx-auto h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            style={{
              width: deviceConfigs[deviceType].width,
              maxHeight: deviceType !== 'desktop' ? deviceConfigs[deviceType].height : 'auto'
            }}
          >
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-terracota to-terracota/80 text-white p-4">
              <p className="text-sm opacity-90">{courseName}</p>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                {getContentIcon(content.type)}
                {content.title}
              </h3>
            </div>

            {/* Meta Information */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {getContentTypeLabel(content.type)}
                </span>
                
                {content.estimatedDuration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {content.estimatedDuration} min
                  </span>
                )}

                {content.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(content.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                )}

                {content.isRequired && (
                  <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Publicado
                  </span>
                )}
              </div>

              {content.description && (
                <p className="mt-3 text-gray-700 dark:text-gray-300">
                  {content.description}
                </p>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100% - 200px)' }}>
              {renderContentBody()}
            </div>

            {/* Student View Footer */}
            <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4 inline mr-1" />
                  Visualização da Aluna
                </p>
                {content.type === ContentType.EXERCISE && (
                  <button className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors text-sm">
                    Enviar Resposta
                  </button>
                )}
                {content.type === ContentType.VIDEO && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Marcar como Concluído
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dispositivo: {deviceConfigs[deviceType].label}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Fechar Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;