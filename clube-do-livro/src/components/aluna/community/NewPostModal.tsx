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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && content.trim()) {
      onSubmit({
        category: category as PostCategory,
        weekNumber,
        content: content.trim()
      });
      // Reset form
      setCategory('');
      setContent('');
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

            {/* Week Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semana relacionada
              </label>
              <select
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
              >
                {Array.from({ length: 17 }, (_, i) => i + 1).map((week) => (
                  <option key={week} value={week}>
                    Semana {week}
                  </option>
                ))}
              </select>
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
            </div>

            {/* Attachment Option */}
            <div className="mb-6">
              <button
                type="button"
                className="flex items-center gap-2 text-gray-600 hover:text-terracota transition-colors"
              >
                <span>📎</span>
                <span className="text-sm">Anexar imagem</span>
              </button>
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