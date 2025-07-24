import React, { useState } from 'react';
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
}

const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentWeek
}) => {
  const [category, setCategory] = useState<PostCategory | ''>('');
  const [weekNumber, setWeekNumber] = useState(currentWeek);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && content.trim()) {
      onSubmit({
        category: category as PostCategory,
        weekNumber,
        content: content.trim(),
        title: title.trim() || undefined
      });
      // Reset form
      setCategory('');
      setContent('');
      setTitle('');
      setWeekNumber(currentWeek);
      onClose();
    }
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
              </label>
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
                  className="p-2 text-gray-600 hover:text-terracota hover:bg-gray-100 rounded transition-colors"
                  title="Adicionar Enquete"
                >
                  <span className="text-lg">📊</span>
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:text-terracota hover:bg-gray-100 rounded transition-colors"
                  title="Adicionar Vídeo"
                >
                  <span className="text-lg">🎥</span>
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:text-terracota hover:bg-gray-100 rounded transition-colors"
                  title="Adicionar Link"
                >
                  <span className="text-lg">🔗</span>
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:text-terracota hover:bg-gray-100 rounded transition-colors"
                  title="Adicionar Foto"
                >
                  <span className="text-lg">📷</span>
                </button>
              </div>
            </div>
          </div>

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