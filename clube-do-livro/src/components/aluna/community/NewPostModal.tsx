import React, { useState, useEffect } from 'react';
import { PostCategory } from '../../../types';
import { categoryConfigs } from '../../../utils/categories';
import { XIcon } from '../../Icons';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: {
    category: PostCategory;
    weekNumber: number;
    content: string;
    title?: string;
  }) => void;
  currentWeek: number;
  preselectedCategory?: PostCategory;
  disableCategoryEdit?: boolean;
}

const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentWeek,
  preselectedCategory,
  disableCategoryEdit = false
}) => {
  const [category, setCategory] = useState<PostCategory | ''>(preselectedCategory || '');
  const [weekNumber, setWeekNumber] = useState(currentWeek);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  
  // Estados para tipos de conteúdo
  const [activeContentType, setActiveContentType] = useState<'poll' | 'video' | 'link' | 'photo' | null>(null);
  const [pollData, setPollData] = useState({
    question: '',
    options: ['', '']
  });
  const [videoData, setVideoData] = useState({
    url: '',
    file: null as File | null
  });
  const [linkData, setLinkData] = useState({
    url: '',
    preview: null as { title: string; description: string; image?: string } | null
  });
  const [photoData, setPhotoData] = useState({
    files: [] as File[],
    previews: [] as string[]
  });

  // Atualizar categoria quando preselectedCategory mudar
  useEffect(() => {
    if (preselectedCategory) {
      setCategory(preselectedCategory);
    }
  }, [preselectedCategory]);

  if (!isOpen) return null;

  // Funções auxiliares
  const handleContentTypeClick = (type: 'poll' | 'video' | 'link' | 'photo') => {
    setActiveContentType(activeContentType === type ? null : type);
  };

  const addPollOption = () => {
    setPollData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removePollOption = (index: number) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setPhotoData(prev => ({
      files: [...prev.files, ...files],
      previews: [...prev.previews, ...newPreviews]
    }));
  };

  const removePhoto = (index: number) => {
    setPhotoData(prev => ({
      files: prev.files.filter((_, i) => i !== index),
      previews: prev.previews.filter((_, i) => i !== index)
    }));
  };

  // Simular preview de link (em produção, usar API real)
  const generateLinkPreview = async (url: string) => {
    // Simulação de preview
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setLinkData(prev => ({
        ...prev,
        preview: {
          title: 'Vídeo do YouTube',
          description: 'Conteúdo em vídeo do YouTube',
          image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop'
        }
      }));
    } else if (url.includes('instagram.com')) {
      setLinkData(prev => ({
        ...prev,
        preview: {
          title: 'Post do Instagram',
          description: 'Conteúdo do Instagram',
          image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=300&h=200&fit=crop'
        }
      }));
    } else {
      setLinkData(prev => ({
        ...prev,
        preview: {
          title: 'Link Compartilhado',
          description: 'Conteúdo web externo'
        }
      }));
    }
  };

  const resetForm = () => {
    setCategory(preselectedCategory || '');
    setContent('');
    setTitle('');
    setWeekNumber(currentWeek);
    setActiveContentType(null);
    setPollData({ question: '', options: ['', ''] });
    setVideoData({ url: '', file: null });
    setLinkData({ url: '', preview: null });
    setPhotoData({ files: [], previews: [] });
  };

  // Validação dos campos condicionais
  const validateConditionalFields = (): boolean => {
    if (activeContentType === 'poll') {
      if (!pollData.question.trim()) {
        alert('Por favor, adicione uma pergunta para a enquete.');
        return false;
      }
      if (pollData.options.filter(opt => opt.trim()).length < 2) {
        alert('A enquete precisa de pelo menos 2 opções preenchidas.');
        return false;
      }
    }
    
    if (activeContentType === 'video') {
      if (!videoData.url && !videoData.file) {
        alert('Por favor, adicione um link de vídeo ou faça upload de um arquivo.');
        return false;
      }
      if (videoData.url && !videoData.url.match(/^https?:\/\/.+/)) {
        alert('Por favor, insira uma URL válida para o vídeo.');
        return false;
      }
    }
    
    if (activeContentType === 'link') {
      if (!linkData.url) {
        alert('Por favor, adicione uma URL para compartilhar.');
        return false;
      }
      if (!linkData.url.match(/^https?:\/\/.+/)) {
        alert('Por favor, insira uma URL válida.');
        return false;
      }
    }
    
    if (activeContentType === 'photo') {
      if (photoData.files.length === 0) {
        alert('Por favor, selecione pelo menos uma foto.');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!category) {
      alert('Por favor, selecione uma categoria.');
      return;
    }
    
    if (!content.trim()) {
      alert('Por favor, escreva o conteúdo da postagem.');
      return;
    }
    
    // Validações condicionais
    if (activeContentType && !validateConditionalFields()) {
      return;
    }
    
    // Preparar dados da postagem
    const postData = {
      category: category as PostCategory,
      weekNumber,
      content: content.trim(),
      title: title.trim() || undefined,
      // Dados condicionais (em produção, seriam enviados para o backend)
      ...(activeContentType === 'poll' && { poll: pollData }),
      ...(activeContentType === 'video' && { video: videoData }),
      ...(activeContentType === 'link' && { link: linkData }),
      ...(activeContentType === 'photo' && { photos: photoData })
    };
    
    onSubmit(postData);
    // Reset form
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-2xl font-semibold text-gray-900">Criar Nova Postagem</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Category Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
                {disableCategoryEdit && preselectedCategory && (
                  <span className="ml-2 text-xs text-terracota font-medium">
                    (Pré-selecionada automaticamente)
                  </span>
                )}
              </label>
              {disableCategoryEdit && preselectedCategory ? (
                <div className="w-full px-4 py-3 border-2 border-terracota/30 bg-terracota/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    {categoryConfigs.find(cat => cat.id === preselectedCategory)?.icon}
                    <span className="font-medium text-terracota">
                      {categoryConfigs.find(cat => cat.id === preselectedCategory)?.label}
                    </span>
                    <span className="ml-auto text-xs text-gray-500">✓ Fixada</span>
                  </div>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PostCategory)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categoryConfigs.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Title Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título (opcional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Dê um título à sua postagem"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
              />
            </div>

            {/* Content Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Digite sua mensagem aqui..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent resize-none"
                required
              />
              
              {/* Content Type Toolbar */}
              <div className="mt-2 flex items-center gap-2 border-t pt-2">
                <button
                  type="button"
                  onClick={() => handleContentTypeClick('poll')}
                  className={`p-2 hover:text-terracota hover:bg-gray-100 rounded transition-colors ${
                    activeContentType === 'poll' ? 'text-terracota bg-terracota/10' : 'text-gray-600'
                  }`}
                  title="Adicionar Enquete"
                >
                  <span className="text-lg">📊</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleContentTypeClick('video')}
                  className={`p-2 hover:text-terracota hover:bg-gray-100 rounded transition-colors ${
                    activeContentType === 'video' ? 'text-terracota bg-terracota/10' : 'text-gray-600'
                  }`}
                  title="Adicionar Vídeo"
                >
                  <span className="text-lg">🎥</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleContentTypeClick('link')}
                  className={`p-2 hover:text-terracota hover:bg-gray-100 rounded transition-colors ${
                    activeContentType === 'link' ? 'text-terracota bg-terracota/10' : 'text-gray-600'
                  }`}
                  title="Adicionar Link"
                >
                  <span className="text-lg">🔗</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleContentTypeClick('photo')}
                  className={`p-2 hover:text-terracota hover:bg-gray-100 rounded transition-colors ${
                    activeContentType === 'photo' ? 'text-terracota bg-terracota/10' : 'text-gray-600'
                  }`}
                  title="Adicionar Foto"
                >
                  <span className="text-lg">📷</span>
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Content Fields */}
          {activeContentType && (
            <div className="p-6 border-t bg-gray-50">
              {/* Poll Fields */}
              {activeContentType === 'poll' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <span>📊</span>
                    Configurar Enquete
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pergunta da Enquete
                    </label>
                    <input
                      type="text"
                      value={pollData.question}
                      onChange={(e) => setPollData(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Qual é sua pergunta?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opções de Resposta
                    </label>
                    <div className="space-y-2">
                      {pollData.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...pollData.options];
                              newOptions[index] = e.target.value;
                              setPollData(prev => ({ ...prev, options: newOptions }));
                            }}
                            placeholder={`Opção ${index + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                          />
                          {pollData.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removePollOption(index)}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addPollOption}
                      className="mt-2 text-sm text-terracota hover:text-marrom-escuro"
                    >
                      + Adicionar opção
                    </button>
                  </div>
                </div>
              )}

              {/* Video Fields */}
              {activeContentType === 'video' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <span>🎥</span>
                    Adicionar Vídeo
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL do Vídeo
                    </label>
                    <input
                      type="url"
                      value={videoData.url}
                      onChange={(e) => setVideoData(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Suportado: YouTube, Vimeo, Instagram, TikTok
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <span className="text-gray-400 text-sm">ou</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload de Vídeo
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Máximo 100MB, formatos: MP4, MOV, AVI
                    </p>
                  </div>
                </div>
              )}

              {/* Link Fields */}
              {activeContentType === 'link' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <span>🔗</span>
                    Compartilhar Link
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={linkData.url}
                      onChange={(e) => {
                        const url = e.target.value;
                        setLinkData(prev => ({ ...prev, url }));
                        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                          generateLinkPreview(url);
                        }
                      }}
                      placeholder="https://exemplo.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                    />
                  </div>
                  
                  {/* Link Preview */}
                  {linkData.preview && (
                    <div className="border rounded-lg p-3 bg-white">
                      <div className="flex gap-3">
                        {linkData.preview.image && (
                          <img
                            src={linkData.preview.image}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-gray-900">{linkData.preview.title}</h5>
                          <p className="text-xs text-gray-600 mt-1">{linkData.preview.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{linkData.url}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Photo Fields */}
              {activeContentType === 'photo' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <span>📷</span>
                    Adicionar Fotos
                  </h4>
                  
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Máximo 5 fotos, 10MB cada. Formatos: JPG, PNG, GIF
                    </p>
                  </div>
                  
                  {/* Photo Previews */}
                  {photoData.previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {photoData.previews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions - Always visible at bottom */}
          <div className="border-t p-6 flex justify-end gap-4 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-terracota text-white rounded-lg hover:bg-marrom-escuro transition-colors"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPostModal;