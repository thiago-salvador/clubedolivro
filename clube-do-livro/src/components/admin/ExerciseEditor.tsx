import React, { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff, Clock, Calendar } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { CourseContent, ContentType } from '../../types/admin.types';

interface ExerciseEditorProps {
  content?: CourseContent;
  onSave: (content: CourseContent) => void;
  onCancel: () => void;
  chapterId: string;
}

const ExerciseEditor: React.FC<ExerciseEditorProps> = ({
  content,
  onSave,
  onCancel,
  chapterId
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    exerciseContent: '',
    instructions: '',
    estimatedTime: 30,
    isPublished: true,
    publishDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    if (content && content.type === ContentType.EXERCISE) {
      setFormData({
        title: content.title,
        description: content.description || '',
        exerciseContent: content.textContent || '',
        instructions: content.exerciseInstructions || '',
        estimatedTime: content.estimatedDuration || 30,
        isPublished: content.isRequired,
        publishDate: content.createdAt 
          ? new Date(content.createdAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      });
    }
  }, [content]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.exerciseContent.trim()) {
      newErrors.exerciseContent = 'Conteúdo do exercício é obrigatório';
    }

    if (formData.estimatedTime <= 0) {
      newErrors.estimatedTime = 'Tempo estimado deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const exerciseData: CourseContent = {
      id: content?.id || `exercise-${Date.now()}`,
      chapterId: chapterId,
      type: ContentType.EXERCISE,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      textContent: formData.exerciseContent,
      exerciseInstructions: formData.instructions.trim() || undefined,
      estimatedDuration: formData.estimatedTime,
      orderIndex: content?.orderIndex || 0,
      isRequired: formData.isPublished,
      createdAt: content?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onSave(exerciseData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {content ? 'Editar Exercício' : 'Novo Exercício'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={isPreviewMode ? 'Editar' : 'Visualizar'}
            >
              {isPreviewMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isPreviewMode ? (
            /* Preview Mode */
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h1>{formData.title}</h1>
              {formData.description && <p className="lead">{formData.description}</p>}
              
              {formData.instructions && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <h3 className="text-blue-900 dark:text-blue-100 mt-0">Instruções</h3>
                  <div dangerouslySetInnerHTML={{ __html: formData.instructions }} />
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 my-6">
                <h3 className="mt-0 mb-4">Exercício</h3>
                <div dangerouslySetInnerHTML={{ __html: formData.exerciseContent }} />
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Tempo estimado: {formData.estimatedTime} minutos</span>
                </div>
                {formData.isPublished && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Publicação: {new Date(formData.publishDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título do Exercício <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700"
                  placeholder="Ex: Reflexão sobre Autoconhecimento"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700"
                  placeholder="Breve descrição do exercício..."
                />
              </div>

              {/* Instructions */}
              <div>
                <RichTextEditor
                  label="Instruções (opcional)"
                  value={formData.instructions}
                  onChange={(value) => handleInputChange('instructions', value)}
                  placeholder="Instruções de como realizar o exercício..."
                  minHeight="100px"
                  maxHeight="200px"
                />
              </div>

              {/* Exercise Content */}
              <div>
                <RichTextEditor
                  label="Conteúdo do Exercício"
                  required
                  value={formData.exerciseContent}
                  onChange={(value) => handleInputChange('exerciseContent', value)}
                  placeholder="Digite o conteúdo completo do exercício..."
                  minHeight="300px"
                  error={errors.exerciseContent}
                />
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Estimated Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tempo Estimado (minutos) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedTime}
                    onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value) || 0)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700"
                  />
                  {errors.estimatedTime && <p className="text-red-500 text-sm mt-1">{errors.estimatedTime}</p>}
                </div>

                {/* Publish Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Publicação
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700"
                  />
                </div>

                {/* Is Published */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.isPublished ? 'published' : 'draft'}
                    onChange={(e) => handleInputChange('isPublished', e.target.value === 'published')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700"
                  >
                    <option value="published">Publicado</option>
                    <option value="draft">Rascunho</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPreviewMode}
            className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {content ? 'Salvar Alterações' : 'Criar Exercício'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseEditor;