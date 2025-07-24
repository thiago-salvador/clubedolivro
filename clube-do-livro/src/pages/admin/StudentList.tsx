import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Download,
  Upload,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Tag,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  Trash2,
  Edit2,
  Eye,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { studentService, StudentWithTags, StudentFilters } from '../../services/student.service';
import { UserRole } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AddStudentModal from '../../components/admin/AddStudentModal';

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentWithTags[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentWithTags[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc'
  });
  
  // Filters
  const [filters, setFilters] = useState<StudentFilters>({
    search: '',
    tags: [],
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0
  });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, filters]);

  const loadStudents = () => {
    setLoading(true);
    try {
      const allStudents = studentService.getAllStudents();
      setStudents(allStudents);
      
      const studentStats = studentService.getStats();
      setStats({
        total: studentStats.total,
        active: studentStats.active,
        inactive: studentStats.inactive,
        newThisMonth: studentStats.newThisMonth
      });
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = studentService.getStudentsByFilter(filters);
    setFilteredStudents(filtered);
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const handleSelectStudent = (id: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudents(newSelected);
  };

  const handleSort = (key: string) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    setFilters({
      ...filters,
      sortBy: key as any,
      sortOrder: direction
    });
  };

  const handleBulkActivate = () => {
    const updated = studentService.bulkUpdateStatus(Array.from(selectedStudents), true);
    if (updated > 0) {
      loadStudents();
      setSelectedStudents(new Set());
      setShowBulkActions(false);
    }
  };

  const handleBulkDeactivate = () => {
    const updated = studentService.bulkUpdateStatus(Array.from(selectedStudents), false);
    if (updated > 0) {
      loadStudents();
      setSelectedStudents(new Set());
      setShowBulkActions(false);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir ${selectedStudents.size} aluna(s)?`)) {
      const deleted = studentService.bulkDelete(Array.from(selectedStudents));
      if (deleted > 0) {
        loadStudents();
        setSelectedStudents(new Set());
        setShowBulkActions(false);
      }
    }
  };

  const handleResetPassword = (student: StudentWithTags) => {
    if (window.confirm(`Enviar email de redefinição de senha para ${student.name}?`)) {
      try {
        const token = studentService.resetPassword(student.id);
        alert(`Email de redefinição enviado para ${student.email}`);
      } catch (error) {
        alert('Erro ao resetar senha');
      }
    }
  };

  const handleExport = () => {
    const csv = [
      ['Nome', 'Email', 'Telefone', 'Status', 'Data de Entrada', 'Tags'],
      ...filteredStudents.map(s => [
        s.name,
        s.email,
        s.phoneNumber || '',
        s.isActive ? 'Ativa' : 'Inativa',
        format(s.joinedDate, 'dd/MM/yyyy'),
        s.tags.map(t => t.tag.name).join(', ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alunas_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const handleStudentCreated = (newStudent: StudentWithTags) => {
    loadStudents(); // Reload the list to include the new student
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestão de Alunas
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie alunas, tags e acessos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Nova Aluna
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Alunas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ativas</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Inativas</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.inactive}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Novas este mês</p>
              <p className="text-2xl font-bold text-terracota">{stats.newThisMonth}</p>
            </div>
            <div className="p-3 bg-terracota/10 rounded-lg">
              <Calendar className="w-6 h-6 text-terracota" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Buscar por nome, email ou telefone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
                showFilters
                  ? 'bg-terracota text-white border-terracota'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {selectedStudents.size > 0 && (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedStudents.size} selecionada(s)
              </span>
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Ações
                {showBulkActions ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />}
              </button>
            </div>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700"
                >
                  <option value="all">Todas</option>
                  <option value="active">Ativas</option>
                  <option value="inactive">Inativas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ordenar por
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700"
                >
                  <option value="name">Nome</option>
                  <option value="email">Email</option>
                  <option value="joinedDate">Data de Entrada</option>
                  <option value="lastActivity">Última Atividade</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({
                      search: '',
                      tags: [],
                      status: 'all',
                      sortBy: 'name',
                      sortOrder: 'asc'
                    });
                    setShowFilters(false);
                  }}
                  className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {showBulkActions && selectedStudents.size > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkActivate}
                className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50"
              >
                Ativar Selecionadas
              </button>
              <button
                onClick={handleBulkDeactivate}
                className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded hover:bg-orange-200 dark:hover:bg-orange-900/50"
              >
                Desativar Selecionadas
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
              >
                Excluir Selecionadas
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-terracota focus:ring-terracota"
                  />
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Aluna
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort('joinedDate')}
                >
                  <div className="flex items-center gap-1">
                    Entrada
                    {sortConfig.key === 'joinedDate' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Carregando alunas...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma aluna encontrada
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.has(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="rounded border-gray-300 text-terracota focus:ring-terracota"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=B8654B&color=fff`}
                          alt={student.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {student.coursesEnrolled} curso(s)
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {student.email}
                        </p>
                        {student.phoneNumber && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {student.phoneNumber}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {student.tags.map((userTag) => (
                          <span
                            key={userTag.tag.id}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: userTag.tag.color + '20',
                              color: userTag.tag.color
                            }}
                          >
                            {userTag.tag.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}>
                        {student.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {format(student.joinedDate, 'dd/MM/yyyy')}
                      </p>
                      {student.lastActivity && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Última atividade: {format(student.lastActivity, 'dd/MM', { locale: ptBR })}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/students/${student.id}`)}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/students/${student.id}/edit`)}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(student)}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          title="Resetar senha"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir ${student.name}?`)) {
                              studentService.deleteStudent(student.id);
                              loadStudents();
                            }
                          }}
                          className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onStudentCreated={handleStudentCreated}
      />
    </div>
  );
}