import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Tag,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  RefreshCw,
  Link2
} from 'lucide-react';
import { tagService, TagWithStats, TagFilters } from '../../services/tag.service';
import { CourseAccessLevel } from '../../types/admin.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import TagProductAssociationManager from '../../components/admin/TagProductAssociationManager';
import StudentsByTagViewer from '../../components/admin/StudentsByTagViewer';

export default function TagManager() {
  const [activeTab, setActiveTab] = useState<'tags' | 'associations' | 'students'>('tags');
  const [tags, setTags] = useState<TagWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TagFilters>({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagWithStats | null>(null);

  const [createForm, setCreateForm] = useState({
    name: '',
    slug: '',
    hotmartProductId: '',
    accessLevel: CourseAccessLevel.FREE,
    color: '#B8654B',
    isActive: true
  });

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    loadTags();
  }, [filters]);

  const loadTags = () => {
    setLoading(true);
    try {
      const filteredTags = tagService.getFilteredTags(filters);
      setTags(filteredTags);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = () => {
    const validationErrors = tagService.validateTag(createForm);
    setErrors(validationErrors);

    if (validationErrors.length > 0) return;

    try {
      tagService.createTag(createForm);
      setCreateForm({
        name: '',
        slug: '',
        hotmartProductId: '',
        accessLevel: CourseAccessLevel.FREE,
        color: '#B8654B',
        isActive: true
      });
      setShowCreateModal(false);
      setErrors([]);
      loadTags();
    } catch (error) {
      console.error('Error creating tag:', error);
      setErrors(['Erro ao criar tag']);
    }
  };

  const handleUpdateTag = () => {
    if (!editingTag) return;

    const validationErrors = tagService.validateTag(createForm, editingTag.id);
    setErrors(validationErrors);

    if (validationErrors.length > 0) return;

    try {
      tagService.updateTag(editingTag.id, createForm);
      setEditingTag(null);
      setShowCreateModal(false);
      setErrors([]);
      loadTags();
    } catch (error) {
      console.error('Error updating tag:', error);
      setErrors(['Erro ao atualizar tag']);
    }
  };

  const handleDeleteTag = (tag: TagWithStats) => {
    if (window.confirm(`Tem certeza que deseja excluir a tag "${tag.name}"? Esta ação não pode ser desfeita.`)) {
      try {
        tagService.deleteTag(tag.id);
        loadTags();
      } catch (error) {
        console.error('Error deleting tag:', error);
        alert('Erro ao excluir tag');
      }
    }
  };

  const handleToggleStatus = (tag: TagWithStats) => {
    try {
      tagService.toggleTagStatus(tag.id);
      loadTags();
    } catch (error) {
      console.error('Error toggling tag status:', error);
      alert('Erro ao alterar status da tag');
    }
  };

  const handleEditTag = (tag: TagWithStats) => {
    setEditingTag(tag);
    setCreateForm({
      name: tag.name,
      slug: tag.slug,
      hotmartProductId: tag.hotmartProductId || '',
      accessLevel: tag.accessLevel,
      color: tag.color,
      isActive: tag.isActive
    });
    setErrors([]);
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setCreateForm({
      name: '',
      slug: '',
      hotmartProductId: '',
      accessLevel: CourseAccessLevel.FREE,
      color: '#B8654B',
      isActive: true
    });
    setEditingTag(null);
    setErrors([]);
    setShowCreateModal(false);
  };

  const handleBulkToggleStatus = (active: boolean) => {
    if (selectedTags.length === 0) return;

    const action = active ? 'ativar' : 'desativar';
    if (window.confirm(`Tem certeza que deseja ${action} ${selectedTags.length} tag(s) selecionada(s)?`)) {
      try {
        selectedTags.forEach(tagId => {
          const tag = tags.find(t => t.id === tagId);
          if (tag && tag.isActive !== active) {
            tagService.toggleTagStatus(tagId);
          }
        });
        setSelectedTags([]);
        loadTags();
      } catch (error) {
        console.error('Error bulk toggling tags:', error);
        alert('Erro ao alterar status das tags');
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedTags.length === 0) return;

    if (window.confirm(`Tem certeza que deseja excluir ${selectedTags.length} tag(s) selecionada(s)? Esta ação não pode ser desfeita.`)) {
      try {
        selectedTags.forEach(tagId => {
          tagService.deleteTag(tagId);
        });
        setSelectedTags([]);
        loadTags();
      } catch (error) {
        console.error('Error bulk deleting tags:', error);
        alert('Erro ao excluir tags');
      }
    }
  };

  const statistics = tagService.getStatistics();
  const availableColors = tagService.getAvailableColors();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-terracota" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Carregando tags...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestão de Tags
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie as tags de produtos e suas associações com o Hotmart
          </p>
        </div>
        {activeTab === 'tags' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Tag
          </button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tags')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tags'
                ? 'border-terracota text-terracota'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Tag className="w-4 h-4 inline mr-2" />
            Tags de Produtos
          </button>
          <button
            onClick={() => setActiveTab('associations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'associations'
                ? 'border-terracota text-terracota'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Link2 className="w-4 h-4 inline mr-2" />
            Associações Hotmart
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'students'
                ? 'border-terracota text-terracota'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Alunas por Tag
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'tags' ? (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Tags</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.total}</p>
            </div>
            <div className="p-3 bg-terracota/10 rounded-lg">
              <Tag className="w-6 h-6 text-terracota" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tags Ativas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.active}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tags Inativas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.inactive}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tags Premium</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.byAccessLevel[CourseAccessLevel.PREMIUM]}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tags..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                showFilters 
                  ? 'bg-terracota text-white border-terracota' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters(prev => ({ 
                  ...prev, 
                  sortBy: sortBy as TagFilters['sortBy'], 
                  sortOrder: sortOrder as 'asc' | 'desc' 
                }));
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="name-asc">Nome (A-Z)</option>
              <option value="name-desc">Nome (Z-A)</option>
              <option value="studentsCount-desc">Mais Alunas</option>
              <option value="studentsCount-asc">Menos Alunas</option>
              <option value="coursesCount-desc">Mais Cursos</option>
              <option value="coursesCount-asc">Menos Cursos</option>
              <option value="createdAt-desc">Mais Recentes</option>
              <option value="createdAt-asc">Mais Antigas</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nível de Acesso
                </label>
                <select
                  value={filters.accessLevel || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    accessLevel: e.target.value as CourseAccessLevel || undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Todos os níveis</option>
                  <option value={CourseAccessLevel.FREE}>Gratuito</option>
                  <option value={CourseAccessLevel.PREMIUM}>Premium</option>
                  <option value={CourseAccessLevel.VIP}>VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.isActive === undefined ? '' : filters.isActive.toString()}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    isActive: e.target.value === '' ? undefined : e.target.value === 'true'
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Todos os status</option>
                  <option value="true">Ativas</option>
                  <option value="false">Inativas</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedTags.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {selectedTags.length} tag(s) selecionada(s)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkToggleStatus(true)}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Ativar
              </button>
              <button
                onClick={() => handleBulkToggleStatus(false)}
                className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
              >
                Desativar
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Excluir
              </button>
              <button
                onClick={() => setSelectedTags([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tags Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTags.length === tags.length && tags.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTags(tags.map(tag => tag.id));
                      } else {
                        setSelectedTags([]);
                      }
                    }}
                    className="rounded border-gray-300 text-terracota focus:ring-terracota"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nível de Acesso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Alunas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cursos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Criada em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags(prev => [...prev, tag.id]);
                        } else {
                          setSelectedTags(prev => prev.filter(id => id !== tag.id));
                        }
                      }}
                      className="rounded border-gray-300 text-terracota focus:ring-terracota"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {tag.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {tag.slug}
                        </div>
                        {tag.hotmartProductId && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Hotmart: {tag.hotmartProductId}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessLevelColor(tag.accessLevel)}`}>
                      {getAccessLevelLabel(tag.accessLevel)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <Users className="w-4 h-4 mr-1 text-gray-400" />
                      {tag.studentsCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <BookOpen className="w-4 h-4 mr-1 text-gray-400" />
                      {tag.coursesCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(tag)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tag.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      } hover:opacity-80`}
                    >
                      {tag.isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativa
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Inativa
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {format(tag.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditTag(tag)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(tag)}
                        className={`${
                          tag.isActive
                            ? 'text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300'
                            : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                        }`}
                        title={tag.isActive ? 'Desativar' : 'Ativar'}
                      >
                        {tag.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tags.length === 0 && (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma tag encontrada
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {filters.search || filters.accessLevel || filters.isActive !== undefined
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando sua primeira tag'}
              </p>
              {!filters.search && !filters.accessLevel && filters.isActive === undefined && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Criar primeira tag
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingTag ? 'Editar Tag' : 'Nova Tag'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4">
              {errors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <ul className="text-sm text-red-800 dark:text-red-200">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome*
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Relacionamentos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={createForm.slug}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="relacionamentos (será gerado automaticamente se vazio)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ID do Produto Hotmart
                  </label>
                  <input
                    type="text"
                    value={createForm.hotmartProductId}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, hotmartProductId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: PROD123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nível de Acesso*
                  </label>
                  <select
                    value={createForm.accessLevel}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, accessLevel: e.target.value as CourseAccessLevel }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value={CourseAccessLevel.FREE}>Gratuito</option>
                    <option value={CourseAccessLevel.PREMIUM}>Premium</option>
                    <option value={CourseAccessLevel.VIP}>VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cor*
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCreateForm(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-lg border-2 ${
                          createForm.color === color
                            ? 'border-gray-900 dark:border-white'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={createForm.color}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, color: e.target.value }))}
                    className="mt-2 w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={createForm.isActive}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300 text-terracota focus:ring-terracota"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Tag ativa
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={editingTag ? handleUpdateTag : handleCreateTag}
                className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90"
              >
                {editingTag ? 'Atualizar' : 'Criar'} Tag
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      ) : activeTab === 'associations' ? (
        <TagProductAssociationManager />
      ) : (
        <StudentsByTagViewer />
      )}
    </div>
  );
}