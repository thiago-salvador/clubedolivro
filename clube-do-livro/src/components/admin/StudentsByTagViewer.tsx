import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  Mail,
  Phone,
  Calendar,
  Tag,
  Search,
  Filter,
  Download,
  RefreshCw,
  User,
  ArrowLeft
} from 'lucide-react';
import { studentService, StudentWithTags } from '../../services/student.service';
import { tagService, TagWithStats } from '../../services/tag.service';
import { CourseAccessLevel } from '../../types/admin.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface StudentsByTagViewerProps {
  selectedTagId?: string;
  onTagChange?: (tagId: string | null) => void;
}

export default function StudentsByTagViewer({ 
  selectedTagId, 
  onTagChange 
}: StudentsByTagViewerProps) {
  const [tags, setTags] = useState<TagWithStats[]>([]);
  const [students, setStudents] = useState<StudentWithTags[]>([]);
  const [currentTagId, setCurrentTagId] = useState<string | null>(selectedTagId || null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    if (currentTagId) {
      loadStudentsByTag(currentTagId);
    } else {
      setStudents([]);
    }
  }, [currentTagId]);

  const loadTags = () => {
    try {
      const allTags = tagService.getTagsWithStats();
      setTags(allTags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const loadStudentsByTag = (tagId: string) => {
    setLoading(true);
    try {
      const allStudents = studentService.getAllStudents();
      const studentsWithTag = allStudents.filter(student => 
        student.tags && student.tags.some(tag => tag.tagId === tagId)
      );
      setStudents(studentsWithTag);
    } catch (error) {
      console.error('Error loading students by tag:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagSelect = (tagId: string | null) => {
    setCurrentTagId(tagId);
    onTagChange?.(tagId);
  };

  const getFilteredStudents = () => {
    return students.filter(student => {
      const matchesSearch = !searchTerm || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && student.isActive) ||
        (statusFilter === 'inactive' && !student.isActive);

      return matchesSearch && matchesStatus;
    });
  };

  const exportStudentsCSV = () => {
    const filteredStudents = getFilteredStudents();
    const currentTag = tags.find(tag => tag.id === currentTagId);
    
    if (filteredStudents.length === 0) {
      alert('Nenhuma aluna para exportar');
      return;
    }

    const headers = ['Nome', 'Email', 'Telefone', 'Status', 'Data de Cadastro', 'Última Atividade'];
    const rows = filteredStudents.map(student => [
      student.name,
      student.email,
      student.phoneNumber || '',
      student.isActive ? 'Ativa' : 'Inativa',
      format(new Date(student.joinedDate), 'dd/MM/yyyy', { locale: ptBR }),
      student.lastActivity ? format(new Date(student.lastActivity), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `alunas-tag-${currentTag?.slug || 'desconhecida'}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const getAccessLevelLabel = (level: CourseAccessLevel) => {
    const labels = {
      [CourseAccessLevel.FREE]: 'Gratuito',
      [CourseAccessLevel.PREMIUM]: 'Premium',
      [CourseAccessLevel.VIP]: 'VIP'
    };
    return labels[level];
  };

  const getAccessLevelColor = (level: CourseAccessLevel) => {
    const colors = {
      [CourseAccessLevel.FREE]: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      [CourseAccessLevel.PREMIUM]: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      [CourseAccessLevel.VIP]: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
    };
    return colors[level];
  };

  const currentTag = tags.find(tag => tag.id === currentTagId);
  const filteredStudents = getFilteredStudents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Visualização de Alunas por Tag
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize quais alunas estão associadas a cada tag
          </p>
        </div>
      </div>

      {/* Tag Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Selecionar Tag
        </h2>
        
        {currentTag && (
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={() => handleTagSelect(null)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar à seleção
            </button>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: currentTag.color }}
              />
              <span className="font-medium text-gray-900 dark:text-white">
                {currentTag.name}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessLevelColor(currentTag.accessLevel)}`}>
                {getAccessLevelLabel(currentTag.accessLevel)}
              </span>
            </div>
          </div>
        )}

        {!currentTag ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagSelect(tag.id)}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-terracota hover:bg-terracota/5 dark:hover:bg-terracota/10 transition-colors text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {tag.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(tag.accessLevel)}`}>
                    {getAccessLevelLabel(tag.accessLevel)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{tag.studentsCount}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Filters and Actions */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar alunas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativas</option>
                  <option value="inactive">Inativas</option>
                </select>
                
                <button
                  onClick={exportStudentsCSV}
                  disabled={filteredStudents.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
                
                <button
                  onClick={() => currentTagId && loadStudentsByTag(currentTagId)}
                  disabled={!currentTagId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-terracota/10 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-terracota" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Alunas</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alunas Ativas</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {students.filter(s => s.isActive).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alunas Inativas</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {students.filter(s => !s.isActive).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Students List */}
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-8 h-8 animate-spin text-terracota" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">Carregando alunas...</span>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Aluna
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Contato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Última Atividade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Outras Tags
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredStudents.map((student) => {
                        const otherTags = student.tags?.filter(tag => tag.tagId !== currentTagId) || [];
                        return (
                          <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-terracota/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-terracota" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {student.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    ID: {student.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                <div className="flex items-center gap-1 mb-1">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  {student.email}
                                </div>
                                {student.phoneNumber && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {student.phoneNumber}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                student.isActive
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                              }`}>
                                {student.isActive ? 'Ativa' : 'Inativa'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {student.lastActivity ? (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {format(new Date(student.lastActivity), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                </div>
                              ) : (
                                'Nunca'
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {otherTags.length > 0 ? (
                                  otherTags.slice(0, 2).map((userTag) => {
                                    const tag = tags.find(t => t.id === userTag.tagId);
                                    return tag ? (
                                      <span
                                        key={userTag.tagId}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                        style={{ backgroundColor: `${tag.color}20` }}
                                      >
                                        {tag.name}
                                      </span>
                                    ) : null;
                                  })
                                ) : (
                                  <span className="text-xs text-gray-400">Nenhuma outra tag</span>
                                )}
                                {otherTags.length > 2 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                    +{otherTags.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                to={`/admin/students/${student.id}`}
                                className="text-terracota hover:text-terracota/80 flex items-center gap-1 justify-end"
                              >
                                <Eye className="w-4 h-4" />
                                Ver Detalhes
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredStudents.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Nenhuma aluna encontrada
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {students.length === 0 
                          ? `Nenhuma aluna possui a tag "${currentTag.name}"`
                          : 'Tente ajustar os filtros de busca'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}