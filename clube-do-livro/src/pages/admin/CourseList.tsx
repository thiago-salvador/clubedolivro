import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Users,
  Calendar,
  Tag,
  Eye
} from 'lucide-react';
import { Course, CourseStatus } from '../../types/admin.types';
import { useAuth } from '../../contexts/AuthContext';
import CreateCourseModal from '../../components/admin/CreateCourseModal';
import { courseService } from '../../services/course.service';

interface CourseListProps {}

const CourseList: React.FC<CourseListProps> = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  const loadCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await courseService.getAllCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CourseStatus) => {
    const statusConfig = {
      [CourseStatus.PUBLISHED]: { label: 'Publicado', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      [CourseStatus.DRAFT]: { label: 'Rascunho', className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
      [CourseStatus.ARCHIVED]: { label: 'Arquivado', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map(course => course.id));
    }
  };

  const handleCreateCourse = async (courseData: Partial<Course>) => {
    try {
      const newCourse = await courseService.createCourse(courseData);
      setCourses(prev => [newCourse, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      throw error;
    }
  };

  const handleCloneCourse = async (courseId: string) => {
    try {
      const clonedCourse = await courseService.cloneCourse(courseId);
      setCourses(prev => [clonedCourse, ...prev]);
    } catch (error) {
      console.error('Erro ao clonar curso:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const success = await courseService.deleteCourse(courseId);
      if (success) {
        setCourses(prev => prev.filter(course => course.id !== courseId));
        setSelectedCourses(prev => prev.filter(id => id !== courseId));
      }
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCourses.length === 0) return;
    
    const confirmMessage = `Tem certeza que deseja excluir ${selectedCourses.length} curso${selectedCourses.length > 1 ? 's' : ''}? Esta ação não pode ser desfeita.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const success = await courseService.deleteMultipleCourses(selectedCourses);
      if (success) {
        setCourses(prev => prev.filter(course => !selectedCourses.includes(course.id)));
        setSelectedCourses([]);
      }
    } catch (error) {
      console.error('Erro ao excluir cursos:', error);
    }
  };

  const handleBulkClone = async () => {
    if (selectedCourses.length === 0) return;

    try {
      const clonePromises = selectedCourses.map(courseId => courseService.cloneCourse(courseId));
      const clonedCourses = await Promise.all(clonePromises);
      setCourses(prev => [...clonedCourses, ...prev]);
      setSelectedCourses([]);
    } catch (error) {
      console.error('Erro ao clonar cursos:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gerenciar Cursos
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {courses.length} {courses.length === 1 ? 'curso' : 'cursos'} no total
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Curso
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CourseStatus | 'all')}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-40"
            >
              <option value="all">Todos os Status</option>
              <option value={CourseStatus.PUBLISHED}>Publicado</option>
              <option value={CourseStatus.DRAFT}>Rascunho</option>
              <option value={CourseStatus.ARCHIVED}>Arquivado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Nenhum curso encontrado' : 'Nenhum curso criado'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros para encontrar cursos.' 
                : 'Comece criando seu primeiro curso para o Clube do Livro.'}
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Curso
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-terracota focus:ring-terracota border-gray-300 rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedCourses.length > 0 && (
                    <span>{selectedCourses.length} selecionado{selectedCourses.length > 1 ? 's' : ''}</span>
                  )}
                </span>
              </div>
            </div>

            {/* Course Items */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCourses.map((course) => (
                <div key={course.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleSelectCourse(course.id)}
                        className="h-4 w-4 text-terracota focus:ring-terracota border-gray-300 rounded"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {course.name}
                          </h3>
                          {getStatusBadge(course.status)}
                        </div>
                        
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          {course.description}
                        </p>
                        
                        <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {course.currentStudentCount}/{course.maxStudents || '∞'} alunas
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Início: {course.startDate.toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-1" />
                            {course.tags.length} tag{course.tags.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/courses/${course.id}`}
                        className="p-2 text-gray-400 hover:text-terracota transition-colors"
                        title="Ver curso"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/courses/${course.id}`}
                        className="p-2 text-gray-400 hover:text-terracota transition-colors"
                        title="Editar curso"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleCloneCourse(course.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Clonar curso"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Excluir curso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedCourses.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCourses.length} curso{selectedCourses.length > 1 ? 's' : ''} selecionado{selectedCourses.length > 1 ? 's' : ''}
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={handleBulkClone}
                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
              >
                Clonar
              </button>
              <button 
                onClick={handleBulkDelete}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
              >
                Excluir
              </button>
              <button 
                onClick={() => setSelectedCourses([])}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCourse}
      />
    </div>
  );
};

export default CourseList;