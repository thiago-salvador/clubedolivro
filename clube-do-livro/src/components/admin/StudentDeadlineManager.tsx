import React, { useState } from 'react';
import { X, Calendar, Clock, Plus, AlertTriangle, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import { StudentWithTags } from '../../services/student.service';
import { format, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StudentDeadline {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'overdue';
  type: 'assignment' | 'payment' | 'document' | 'meeting' | 'other';
  createdAt: Date;
  createdBy: string;
  completedAt?: Date;
  notes?: string;
}

interface StudentDeadlineManagerProps {
  student: StudentWithTags;
  onClose: () => void;
  onUpdate?: () => void;
}

// Mock deadlines service - in a real app this would be a proper service
class DeadlineService {
  private static STORAGE_KEY = 'student_deadlines';

  static getDeadlines(studentId: string): StudentDeadline[] {
    const allDeadlines = this.getAllDeadlines();
    return allDeadlines.filter(d => d.studentId === studentId);
  }

  static getAllDeadlines(): StudentDeadline[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    const deadlines = JSON.parse(stored);
    return deadlines.map((d: any) => ({
      ...d,
      dueDate: new Date(d.dueDate),
      createdAt: new Date(d.createdAt),
      completedAt: d.completedAt ? new Date(d.completedAt) : undefined
    }));
  }

  static saveDeadlines(deadlines: StudentDeadline[]) {
    const allDeadlines = this.getAllDeadlines();
    const otherDeadlines = allDeadlines.filter(d => !deadlines.some(nd => nd.studentId === d.studentId));
    const combined = [...otherDeadlines, ...deadlines];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(combined));
  }

  static addDeadline(deadline: Omit<StudentDeadline, 'id' | 'createdAt' | 'status'>): StudentDeadline {
    const newDeadline: StudentDeadline = {
      ...deadline,
      id: `deadline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      status: isAfter(new Date(), deadline.dueDate) ? 'overdue' : 'pending'
    };

    const studentDeadlines = this.getDeadlines(deadline.studentId);
    studentDeadlines.push(newDeadline);
    this.saveDeadlines(studentDeadlines);
    
    return newDeadline;
  }

  static updateDeadline(deadlineId: string, updates: Partial<StudentDeadline>): boolean {
    const allDeadlines = this.getAllDeadlines();
    const index = allDeadlines.findIndex(d => d.id === deadlineId);
    
    if (index === -1) return false;
    
    allDeadlines[index] = { ...allDeadlines[index], ...updates };
    
    // Update status based on due date and completion
    if (updates.dueDate) {
      if (allDeadlines[index].status !== 'completed') {
        allDeadlines[index].status = isAfter(new Date(), allDeadlines[index].dueDate) ? 'overdue' : 'pending';
      }
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allDeadlines));
    return true;
  }

  static deleteDeadline(deadlineId: string): boolean {
    const allDeadlines = this.getAllDeadlines();
    const filtered = allDeadlines.filter(d => d.id !== deadlineId);
    
    if (filtered.length === allDeadlines.length) return false;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  static markCompleted(deadlineId: string): boolean {
    return this.updateDeadline(deadlineId, {
      status: 'completed',
      completedAt: new Date()
    });
  }
}

export default function StudentDeadlineManager({ student, onClose, onUpdate }: StudentDeadlineManagerProps) {
  const [deadlines, setDeadlines] = useState<StudentDeadline[]>(() => 
    DeadlineService.getDeadlines(student.id)
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<StudentDeadline | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as StudentDeadline['priority'],
    type: 'assignment' as StudentDeadline['type'],
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      type: 'assignment',
      notes: ''
    });
    setEditingDeadline(null);
    setShowAddForm(false);
  };

  const handleAddDeadline = () => {
    if (!formData.title.trim() || !formData.dueDate) return;

    const deadline = DeadlineService.addDeadline({
      studentId: student.id,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dueDate: new Date(formData.dueDate),
      priority: formData.priority,
      type: formData.type,
      notes: formData.notes.trim() || undefined,
      createdBy: 'admin' // In a real app, this would be the current user
    });

    setDeadlines(prev => [...prev, deadline]);
    resetForm();
    if (onUpdate) onUpdate();
  };

  const handleEditDeadline = (deadline: StudentDeadline) => {
    setEditingDeadline(deadline);
    setFormData({
      title: deadline.title,
      description: deadline.description || '',
      dueDate: format(deadline.dueDate, 'yyyy-MM-dd'),
      priority: deadline.priority,
      type: deadline.type,
      notes: deadline.notes || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateDeadline = () => {
    if (!editingDeadline || !formData.title.trim() || !formData.dueDate) return;

    const success = DeadlineService.updateDeadline(editingDeadline.id, {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dueDate: new Date(formData.dueDate),
      priority: formData.priority,
      type: formData.type,
      notes: formData.notes.trim() || undefined
    });

    if (success) {
      setDeadlines(prev => prev.map(d => 
        d.id === editingDeadline.id 
          ? { ...d, 
              title: formData.title.trim(),
              description: formData.description.trim() || undefined,
              dueDate: new Date(formData.dueDate),
              priority: formData.priority,
              type: formData.type,
              notes: formData.notes.trim() || undefined,
              status: isAfter(new Date(), new Date(formData.dueDate)) ? 'overdue' : d.status === 'completed' ? 'completed' : 'pending'
            }
          : d
      ));
      resetForm();
      if (onUpdate) onUpdate();
    }
  };

  const handleToggleComplete = (deadline: StudentDeadline) => {
    const newStatus = deadline.status === 'completed' ? 'pending' : 'completed';
    const success = DeadlineService.updateDeadline(deadline.id, {
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date() : undefined
    });

    if (success) {
      setDeadlines(prev => prev.map(d => 
        d.id === deadline.id 
          ? { ...d, status: newStatus, completedAt: newStatus === 'completed' ? new Date() : undefined }
          : d
      ));
      if (onUpdate) onUpdate();
    }
  };

  const handleDeleteDeadline = (deadline: StudentDeadline) => {
    if (window.confirm(`Tem certeza que deseja excluir o prazo "${deadline.title}"?`)) {
      const success = DeadlineService.deleteDeadline(deadline.id);
      if (success) {
        setDeadlines(prev => prev.filter(d => d.id !== deadline.id));
        if (onUpdate) onUpdate();
      }
    }
  };

  const getPriorityColor = (priority: StudentDeadline['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    }
  };

  const getStatusIcon = (deadline: StudentDeadline) => {
    switch (deadline.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getTypeLabel = (type: StudentDeadline['type']) => {
    const labels = {
      assignment: 'Tarefa',
      payment: 'Pagamento',
      document: 'Documento',
      meeting: 'Reunião',
      other: 'Outro'
    };
    return labels[type];
  };

  const sortedDeadlines = [...deadlines].sort((a, b) => {
    // Completed items go to bottom
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (b.status === 'completed' && a.status !== 'completed') return -1;
    
    // Then by priority: high -> medium -> low
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then by due date
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Gestão de Prazos
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {student.name} • {deadlines.length} prazo{deadlines.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Add Deadline Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Prazo
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                {editingDeadline ? 'Editar Prazo' : 'Novo Prazo'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título*
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="Ex: Entregar exercício do capítulo 1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Vencimento*
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as StudentDeadline['priority'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as StudentDeadline['type'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-800 dark:text-white"
                  >
                    <option value="assignment">Tarefa</option>
                    <option value="payment">Pagamento</option>
                    <option value="document">Documento</option>
                    <option value="meeting">Reunião</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                  placeholder="Descrição opcional do prazo"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingDeadline ? handleUpdateDeadline : handleAddDeadline}
                  disabled={!formData.title.trim() || !formData.dueDate}
                  className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 disabled:opacity-50"
                >
                  {editingDeadline ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </div>
          )}

          {/* Deadlines List */}
          <div className="space-y-3">
            {sortedDeadlines.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum prazo cadastrado para esta aluna</p>
                <p className="text-sm mt-1">Clique em "Novo Prazo" para adicionar</p>
              </div>
            ) : (
              sortedDeadlines.map((deadline) => (
                <div key={deadline.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(deadline)}
                        <h4 className={`font-medium ${deadline.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                          {deadline.title}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
                          {deadline.priority === 'high' ? 'Alta' : deadline.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                          {getTypeLabel(deadline.type)}
                        </span>
                      </div>
                      
                      {deadline.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {deadline.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Vence: {format(deadline.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                        {deadline.completedAt && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Concluído: {format(deadline.completedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleComplete(deadline)}
                        className={`p-2 rounded-lg ${
                          deadline.status === 'completed'
                            ? 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            : 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                        }`}
                        title={deadline.status === 'completed' ? 'Marcar como pendente' : 'Marcar como concluído'}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditDeadline(deadline)}
                        className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg"
                        title="Editar prazo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDeadline(deadline)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg"
                        title="Excluir prazo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}