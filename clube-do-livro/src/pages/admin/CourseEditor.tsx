import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  ArrowLeft, 
  Save, 
  Eye, 
  Calendar, 
  Users, 
  Upload
} from 'lucide-react';
import { Course, CourseStatus, CourseAccessLevel, CourseChapter, ContentType } from '../../types/admin.types';
import { useAuth } from '../../contexts/AuthContext';
import { courseService } from '../../services/course.service';
import ContentUploader from '../../components/admin/ContentUploader';
import ExerciseEditor from '../../components/admin/ExerciseEditor';
import ContentScheduler from '../../components/admin/ContentScheduler';
import ContentPreview from '../../components/admin/ContentPreview';
import ChannelManager from '../../components/admin/ChannelManager';

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

const CourseEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showExerciseEditor, setShowExerciseEditor] = useState(false);
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [showContentPreview, setShowContentPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>(null);
  
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) {
        navigate('/admin/courses');
        return;
      }

      try {
        setLoading(true);
        const courseData = await courseService.getCourseById(id);
        
        if (!courseData) {
          navigate('/admin/courses');
          return;
        }

        setCourse(courseData);
        setFormData({
          name: courseData.name,
          description: courseData.description,
          status: courseData.status,
          accessLevel: courseData.accessLevel,
          startDate: courseData.startDate.toISOString().split('T')[0],
          endDate: courseData.endDate ? courseData.endDate.toISOString().split('T')[0] : '',
          maxStudents: courseData.maxStudents?.toString() || '',
          coverImage: courseData.coverImage || '',
          backgroundColor: courseData.backgroundColor || '#B8654B',
          textColor: courseData.textColor || '#FFFFFF',
          selectedTags: courseData.tags?.map(tag => tag.id) || []
        });
      } catch (error) {
        console.error('Erro ao carregar curso:', error);
        navigate('/admin/courses');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id, navigate]);

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

  const handleSave = async () => {
    if (!validateForm() || !course) {
      return;
    }

    setSaving(true);
    
    try {
      const updatedCourseData: Partial<Course> = {
        id: course.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        accessLevel: formData.accessLevel,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : undefined,
        coverImage: formData.coverImage || undefined,
        backgroundColor: formData.backgroundColor,
        textColor: formData.textColor,
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
        lastModifiedBy: user!,
        updatedAt: new Date()
      };
      
      const updatedCourse = await courseService.updateCourse(course.id, updatedCourseData);
      setCourse(updatedCourse);
      setHasChanges(false);
      
      // Show success message (could be replaced with a toast notification)
      alert('Curso salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      alert('Erro ao salvar curso. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagsChange = (selectedTags: string[]) => {
    setFormData(prev => ({ ...prev, selectedTags }));
    setHasChanges(true);
  };

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm('Há alterações não salvas. Deseja sair sem salvar?')) {
        navigate('/admin/courses');
      }
    } else {
      navigate('/admin/courses');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracota mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Curso não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            O curso que você está procurando não existe ou foi removido.
          </p>
          <button
            onClick={() => navigate('/admin/courses')}
            className="mt-4 px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors"
          >
            Voltar para Lista de Cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Editar Curso
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                ID: {course.id}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {/* Preview functionality - to be implemented */}}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Informações Básicas
            </h2>
            
            <div className="space-y-4">
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
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Descreva o conteúdo e objetivos do curso..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
                />
              </div>

              {/* Product Tags */}
              <ProductTagSelector
                selectedTags={formData.selectedTags}
                onChange={handleTagsChange}
              />
            </div>
          </div>

          {/* Content Management Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Conteúdo do Curso
            </h2>
            
            <div className="space-y-6">
              {/* Video Content Example */}
              <div>
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Vídeo Principal
                </h3>
                <ContentUploader
                  type={ContentType.VIDEO}
                  currentUrl=""
                  onChange={(url) => {
                    console.log('Vimeo URL:', url);
                    setHasChanges(true);
                  }}
                  helperText="Adicione o vídeo principal do curso"
                />
              </div>

              {/* Audio Content Example */}
              <div>
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Áudio/Podcast
                </h3>
                <ContentUploader
                  type={ContentType.AUDIO}
                  currentUrl=""
                  onChange={(url) => {
                    console.log('Audio URL:', url);
                    setHasChanges(true);
                  }}
                  helperText="Adicione conteúdo de áudio opcional"
                />
              </div>

              {/* Exercise Content */}
              <div>
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Exercícios Terapêuticos
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingExercise(null);
                    setShowExerciseEditor(true);
                  }}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-terracota dark:hover:border-terracota transition-colors flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-terracota dark:hover:text-terracota"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Adicionar Novo Exercício</span>
                </button>
              </div>

              {/* Content Scheduling Example */}
              <div>
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Agendamento de Conteúdo
                </h3>
                {/* Example scheduled content */}
                <ContentScheduler
                  content={{
                    id: 'example-1',
                    chapterId: course?.id || '',
                    type: ContentType.VIDEO,
                    title: 'Aula 1 - Introdução ao Curso',
                    orderIndex: 0,
                    isRequired: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  }}
                  onUpdate={(content) => {
                    console.log('Content scheduled:', content);
                    setHasChanges(true);
                    alert('Conteúdo agendado com sucesso!');
                  }}
                  inline={true}
                />
              </div>

              {/* Content Preview Example */}
              <div>
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Exemplo de Conteúdo com Preview
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Exercício: Reflexão sobre Autoconhecimento
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Exercício terapêutico com perguntas reflexivas
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewContent({
                          id: 'example-exercise',
                          chapterId: course?.id || '',
                          type: ContentType.EXERCISE,
                          title: 'Reflexão sobre Autoconhecimento',
                          description: 'Um exercício para ajudar você a se conhecer melhor',
                          textContent: '<h3>Perguntas para Reflexão</h3><ol><li>O que te faz sentir mais viva?</li><li>Quais são seus maiores medos?</li><li>O que você gostaria de mudar em si mesma?</li></ol>',
                          exerciseInstructions: '<p>Reserve um momento tranquilo e responda com sinceridade. Não há respostas certas ou erradas.</p>',
                          estimatedDuration: 30,
                          orderIndex: 0,
                          isRequired: true,
                          createdAt: new Date(),
                          updatedAt: new Date()
                        });
                        setShowContentPreview(true);
                      }}
                      className="px-3 py-1 bg-terracota text-white rounded hover:bg-terracota/90 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Nota:</strong> A gestão completa de capítulos e conteúdo será implementada em breve. 
                  Por enquanto, você pode testar o upload de URLs de vídeo do Vimeo, criar exercícios e agendar conteúdo.
                </p>
              </div>
            </div>
          </div>

          {/* Debate Channels Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <ChannelManager
              channels={course?.debateChannels || []}
              courseId={course?.id || ''}
              currentUser={user}
              onUpdate={(channels) => {
                console.log('Channels updated:', channels);
                setHasChanges(true);
                // TODO: Implement update logic to course service
              }}
            />
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Configurações
            </h2>
            
            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value={CourseStatus.DRAFT}>Rascunho</option>
                  <option value={CourseStatus.PUBLISHED}>Publicado</option>
                  <option value={CourseStatus.ARCHIVED}>Arquivado</option>
                </select>
              </div>

              {/* Access Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nível de Acesso
                </label>
                <select
                  value={formData.accessLevel}
                  onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value={CourseAccessLevel.FREE}>Gratuito</option>
                  <option value={CourseAccessLevel.PREMIUM}>Premium</option>
                  <option value={CourseAccessLevel.VIP}>VIP</option>
                </select>
              </div>

              {/* Dates */}
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
                  min={formData.startDate}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>

              {/* Max Students */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Máximo de Alunas (opcional)
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
                />
                {errors.maxStudents && <p className="text-red-500 text-sm mt-1">{errors.maxStudents}</p>}
              </div>

              {/* Colors */}
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
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="#B8654B"
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
                  />
                  <input
                    type="text"
                    value={formData.textColor}
                    onChange={(e) => handleInputChange('textColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Course Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Estatísticas
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Alunas inscritas:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {course.currentStudentCount}
                  {course.maxStudents && ` / ${course.maxStudents}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Criado em:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {course.createdAt.toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Atualizado em:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {course.updatedAt.toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Exercise Editor Modal */}
    {showExerciseEditor && (
      <ExerciseEditor
        content={editingExercise}
        chapterId={course?.id || ''}
        onSave={(exercise) => {
          console.log('Exercise saved:', exercise);
          // TODO: Implement save logic to course service
          setShowExerciseEditor(false);
          setHasChanges(true);
          alert('Exercício criado com sucesso!');
        }}
        onCancel={() => {
          setShowExerciseEditor(false);
          setEditingExercise(null);
        }}
      />
    )}

    {/* Content Preview Modal */}
    {showContentPreview && previewContent && (
      <ContentPreview
        content={previewContent}
        courseName={course?.name || 'Nome do Curso'}
        onClose={() => {
          setShowContentPreview(false);
          setPreviewContent(null);
        }}
      />
    )}
    </>
  );
};

export default CourseEditor;