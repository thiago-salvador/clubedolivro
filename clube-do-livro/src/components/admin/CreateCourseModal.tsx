import React, { useState } from 'react';
import { X, BookOpen, Calendar, Users, Upload } from 'lucide-react';
import { Course, CourseStatus, CourseAccessLevel } from '../../types/admin.types';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for available tags - this will later come from a service
const availableTags = [
  {
    id: 'tag-1',
    name: 'Relacionamentos',
    color: '#B8654B',
    description: 'Conteúdo sobre relacionamentos amorosos'
  },
  {
    id: 'tag-2', 
    name: 'Autoconhecimento',
    color: '#4D381B',
    description: 'Jornada de autoconhecimento e crescimento pessoal'
  },
  {
    id: 'tag-3',
    name: 'Ansiedade',
    color: '#7C9885',
    description: 'Técnicas para lidar com ansiedade'
  },
  {
    id: 'tag-4',
    name: 'Depressão',
    color: '#6B8E23',
    description: 'Apoio no tratamento da depressão'
  },
  {
    id: 'tag-5',
    name: 'Carreira',
    color: '#DAA520',
    description: 'Desenvolvimento profissional e carreira'
  }
];

// ProductTagSelector component
interface ProductTagSelectorProps {
  selectedTags: string[];
  onChange: (selectedTags: string[]) => void;
  disabled?: boolean;
}

const ProductTagSelector: React.FC<ProductTagSelectorProps> = ({ selectedTags, onChange, disabled }) => {
  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Tags do Produto
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              disabled={disabled}
              onClick={() => handleTagToggle(tag.id)}
              className={`
                flex items-center p-3 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-terracota bg-terracota/10 text-terracota' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-terracota/50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}
              `}
            >
              <div 
                className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                style={{ backgroundColor: tag.color }}
              />
              <div className="text-left">
                <div className="font-medium text-sm">{tag.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {tag.description}
                </div>
              </div>
              {isSelected && (
                <div className="ml-auto">
                  <div className="w-5 h-5 bg-terracota rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {selectedTags.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selecionada{selectedTags.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: Partial<Course>) => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: CourseStatus.DRAFT,
    accessLevel: CourseAccessLevel.FREE,
    startDate: '',
    endDate: '',
    maxStudents: '',
    coverImage: '',
    backgroundColor: '#B8654B', // terracota default
    textColor: '#FFFFFF',
    selectedTags: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do curso é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    }
    
    if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Data de fim deve ser posterior à data de início';
    }
    
    if (formData.maxStudents && parseInt(formData.maxStudents) <= 0) {
      newErrors.maxStudents = 'Número máximo de estudantes deve ser maior que zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const courseData: Partial<Course> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        accessLevel: formData.accessLevel,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : undefined,
        currentStudentCount: 0,
        coverImage: formData.coverImage || undefined,
        backgroundColor: formData.backgroundColor,
        textColor: formData.textColor,
        instructor: user!,
        tags: formData.selectedTags.map(tagId => {
          const tag = availableTags.find(t => t.id === tagId);
          return tag ? {
            id: tag.id,
            name: tag.name,
            slug: tag.name.toLowerCase().replace(/\s+/g, '-'),
            description: tag.description,
            color: tag.color,
            accessLevel: formData.accessLevel,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          } : null;
        }).filter(Boolean) as any[],
        chapters: [],
        debateChannels: [],
        createdBy: user!,
        lastModifiedBy: user!
      };
      
      await onSubmit(courseData);
      handleClose();
    } catch (error) {
      console.error('Erro ao criar curso:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      status: CourseStatus.DRAFT,
      accessLevel: CourseAccessLevel.FREE,
      startDate: '',
      endDate: '',
      maxStudents: '',
      coverImage: '',
      backgroundColor: '#B8654B',
      textColor: '#FFFFFF',
      selectedTags: [] as string[]
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 text-terracota mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Criar Novo Curso
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Curso *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Ex: Autoestima e Relacionamentos"
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Descreva o conteúdo e objetivos do curso..."
              disabled={loading}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Status and Access Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading}
              >
                <option value={CourseStatus.DRAFT}>Rascunho</option>
                <option value={CourseStatus.PUBLISHED}>Publicado</option>
                <option value={CourseStatus.ARCHIVED}>Arquivado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nível de Acesso
              </label>
              <select
                value={formData.accessLevel}
                onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading}
              >
                <option value={CourseAccessLevel.FREE}>Gratuito</option>
                <option value={CourseAccessLevel.PREMIUM}>Premium</option>
                <option value={CourseAccessLevel.VIP}>VIP</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Data de Início *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={loading}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Data de Fim (opcional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={loading}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Max Students */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Número Máximo de Alunas (opcional)
            </label>
            <input
              type="number"
              value={formData.maxStudents}
              onChange={(e) => handleInputChange('maxStudents', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.maxStudents ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Deixe em branco para ilimitado"
              min="1"
              disabled={loading}
            />
            {errors.maxStudents && <p className="text-red-500 text-sm mt-1">{errors.maxStudents}</p>}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Upload className="w-4 h-4 inline mr-1" />
              Imagem de Capa (URL)
            </label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => handleInputChange('coverImage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="https://exemplo.com/imagem.jpg"
              disabled={loading}
            />
          </div>

          {/* Product Tags */}
          <ProductTagSelector
            selectedTags={formData.selectedTags}
            onChange={(selectedTags) => setFormData(prev => ({ ...prev, selectedTags }))}
            disabled={loading}
          />

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor de Fundo
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  disabled={loading}
                />
                <input
                  type="text"
                  value={formData.backgroundColor}
                  onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="#B8654B"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cor do Texto
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => handleInputChange('textColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  disabled={loading}
                />
                <input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) => handleInputChange('textColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="#FFFFFF"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Curso'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseModal;