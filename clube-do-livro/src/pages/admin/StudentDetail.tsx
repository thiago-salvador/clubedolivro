import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Mail,
  Phone,
  Calendar,
  Clock,
  Tag,
  User,
  BookOpen,
  MessageSquare,
  Activity,
  Settings,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import StudentTagEditor from '../../components/admin/StudentTagEditor';
import ResetPasswordModal from '../../components/admin/ResetPasswordModal';
import StudentDeadlineManager from '../../components/admin/StudentDeadlineManager';
import { studentService, StudentWithTags } from '../../services/student.service';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityLog {
  id: string;
  type: 'login' | 'course_access' | 'community_post' | 'exercise_completed' | 'video_watched';
  description: string;
  timestamp: Date;
  details?: any;
}

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentWithTags | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'courses' | 'settings'>('overview');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showTagEditor, setShowTagEditor] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showDeadlineManager, setShowDeadlineManager] = useState(false);

  useEffect(() => {
    if (id) {
      loadStudent(id);
      loadActivityLogs(id);
    }
  }, [id]);

  const loadStudent = (studentId: string) => {
    setLoading(true);
    try {
      const studentData = studentService.getStudentById(studentId);
      setStudent(studentData || null);
    } catch (error) {
      console.error('Error loading student:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLogs = (studentId: string) => {
    // Mock activity logs - in a real app, this would come from an API
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        type: 'login',
        description: 'Fez login na plataforma',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: '2',
        type: 'video_watched',
        description: 'Assistiu ao vídeo "Capítulo 1: Introdução"',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        details: { videoId: 'chapter-1', duration: '15:30' }
      },
      {
        id: '3',
        type: 'community_post',
        description: 'Criou uma nova postagem na comunidade',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        details: { postTitle: 'Dúvida sobre relacionamentos' }
      },
      {
        id: '4',
        type: 'exercise_completed',
        description: 'Completou exercício "Reflexão sobre autoconhecimento"',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        details: { exerciseId: 'ex-1' }
      },
      {
        id: '5',
        type: 'course_access',
        description: 'Acessou o curso "Relacionamentos Saudáveis"',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      }
    ];
    setActivityLogs(mockLogs);
  };

  const handleResetPassword = () => {
    setShowResetPasswordModal(true);
  };

  const handleDeleteStudent = () => {
    if (!student) return;
    if (window.confirm(`Tem certeza que deseja excluir a aluna ${student.name}? Esta ação não pode ser desfeita.`)) {
      try {
        studentService.deleteStudent(student.id);
        navigate('/admin/students');
      } catch (error) {
        alert('Erro ao excluir aluna');
      }
    }
  };

  const toggleStudentStatus = () => {
    if (!student) return;
    try {
      const updated = studentService.updateStudent(student.id, {
        isActive: !student.isActive
      });
      if (updated) {
        setStudent(updated);
      }
    } catch (error) {
      alert('Erro ao atualizar status da aluna');
    }
  };

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'login':
        return <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'video_watched':
        return <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'community_post':
        return <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'exercise_completed':
        return <CheckCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'course_access':
        return <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-terracota" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Carregando dados da aluna...</span>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Aluna não encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          A aluna solicitada não foi encontrada no sistema.
        </p>
        <button
          onClick={() => navigate('/admin/students')}
          className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90"
        >
          Voltar à lista
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/students')}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {student.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Detalhes da aluna
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/students/${student.id}/edit`)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={toggleStudentStatus}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              student.isActive
                ? 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                : 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50'
            }`}
          >
            {student.isActive ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-6">
          <img
            src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=B8654B&color=fff`}
            alt={student.name}
            className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {student.name}
              </h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                student.isActive
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              }`}>
                {student.isActive ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{student.email}</span>
              </div>
              {student.phoneNumber && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{student.phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Ingressou em {format(student.joinedDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
              {student.lastActivity && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Última atividade: {format(student.lastActivity, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</h3>
                <button
                  onClick={() => setShowTagEditor(true)}
                  className="text-terracota hover:text-terracota/80 text-sm font-medium flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Editar
                </button>
              </div>
              {student.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {student.tags.map((userTag) => (
                    <span
                      key={userTag.tag.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: userTag.tag.color + '20',
                        color: userTag.tag.color
                      }}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {userTag.tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Nenhuma tag atribuída
                </p>
              )}
            </div>

            {/* Notes */}
            {student.notes && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {student.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cursos Inscritos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{student.coursesEnrolled || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Posts na Comunidade</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activityLogs.filter(log => log.type === 'community_post').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Exercícios Completos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activityLogs.filter(log => log.type === 'exercise_completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Visão Geral', icon: User },
              { id: 'activity', label: 'Atividades', icon: Activity },
              { id: 'courses', label: 'Cursos', icon: BookOpen },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === id
                    ? 'border-terracota text-terracota'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informações Detalhadas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome Completo
                    </label>
                    <p className="text-gray-900 dark:text-white">{student.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <p className="text-gray-900 dark:text-white">{student.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefone
                    </label>
                    <p className="text-gray-900 dark:text-white">{student.phoneNumber || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data de Ingresso
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {format(student.joinedDate, 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Histórico de Atividades
              </h3>
              <div className="space-y-4">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(log.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {log.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {format(log.timestamp, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                      {log.details && (
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                          {log.details.videoId && <span>Vídeo ID: {log.details.videoId}</span>}
                          {log.details.duration && <span> • Duração: {log.details.duration}</span>}
                          {log.details.postTitle && <span>Título: "{log.details.postTitle}"</span>}
                          {log.details.exerciseId && <span>Exercício: {log.details.exerciseId}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cursos e Progresso
              </h3>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Dados de curso serão implementados em versão futura</p>
                <p className="text-sm mt-1">Esta seção mostrará o progresso detalhado nos cursos</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ações da Conta
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Resetar Senha</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enviar email de redefinição de senha para a aluna
                    </p>
                  </div>
                  <button
                    onClick={handleResetPassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2 inline" />
                    Resetar
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Status da Conta</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {student.isActive ? 'Desativar acesso da aluna' : 'Reativar acesso da aluna'}
                    </p>
                  </div>
                  <button
                    onClick={toggleStudentStatus}
                    className={`px-4 py-2 rounded-lg ${
                      student.isActive
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {student.isActive ? 'Desativar' : 'Ativar'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Gestão de Prazos</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Gerenciar prazos e tarefas da aluna
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeadlineManager(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Calendar className="w-4 h-4 mr-2 inline" />
                    Gerenciar
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                  <div>
                    <h4 className="font-medium text-red-900 dark:text-red-200">Excluir Aluna</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Esta ação não pode ser desfeita. Todos os dados serão perdidos.
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteStudent}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2 inline" />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tag Editor Modal */}
      {showTagEditor && student && (
        <StudentTagEditor
          student={student}
          onClose={() => setShowTagEditor(false)}
          onTagsUpdated={(updatedStudent) => {
            setStudent(updatedStudent);
            setShowTagEditor(false);
          }}
        />
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && student && (
        <ResetPasswordModal
          student={student}
          onClose={() => setShowResetPasswordModal(false)}
          onSuccess={() => {
            // Reload student data to update lastActivity
            loadStudent(student.id);
          }}
        />
      )}

      {/* Deadline Manager Modal */}
      {showDeadlineManager && student && (
        <StudentDeadlineManager
          student={student}
          onClose={() => setShowDeadlineManager(false)}
          onUpdate={() => {
            // Optionally reload student data or update UI
            loadStudent(student.id);
          }}
        />
      )}
    </div>
  );
}