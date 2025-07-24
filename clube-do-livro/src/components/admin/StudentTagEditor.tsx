import React, { useState } from 'react';
import { X, Tag, Check } from 'lucide-react';
import { StudentWithTags, studentService } from '../../services/student.service';
import { ProductTag, CourseAccessLevel } from '../../types/admin.types';
import { useAuth } from '../../contexts/AuthContext';

interface StudentTagEditorProps {
  student: StudentWithTags;
  onClose: () => void;
  onTagsUpdated: (updatedStudent: StudentWithTags) => void;
}

// Mock available tags - in a real app, this would come from a service
const mockAvailableTags: ProductTag[] = [
  { 
    id: 'tag-1', 
    name: 'Relacionamentos', 
    slug: 'relacionamentos',
    hotmartProductId: 'PROD123', 
    accessLevel: CourseAccessLevel.PREMIUM, 
    color: '#B8654B',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'tag-2', 
    name: 'Autoconhecimento', 
    slug: 'autoconhecimento',
    hotmartProductId: 'PROD124', 
    accessLevel: CourseAccessLevel.FREE, 
    color: '#7C9885',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'tag-3', 
    name: 'Ansiedade', 
    slug: 'ansiedade',
    hotmartProductId: 'PROD125', 
    accessLevel: CourseAccessLevel.PREMIUM, 
    color: '#6B8E23',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'tag-4', 
    name: 'Depressão', 
    slug: 'depressao',
    hotmartProductId: 'PROD126', 
    accessLevel: CourseAccessLevel.PREMIUM, 
    color: '#4682B4',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'tag-5', 
    name: 'Carreira', 
    slug: 'carreira',
    hotmartProductId: 'PROD127', 
    accessLevel: CourseAccessLevel.FREE, 
    color: '#DAA520',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function StudentTagEditor({ student, onClose, onTagsUpdated }: StudentTagEditorProps) {
  const { user } = useAuth();
  const [currentTags, setCurrentTags] = useState(student.tags);
  const [saving, setSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{
    toAdd: ProductTag[];
    toRemove: string[];
  }>({ toAdd: [], toRemove: [] });

  const handleTagToggle = (tag: ProductTag) => {
    const hasTag = currentTags.some(ut => ut.tag.id === tag.id);
    
    if (hasTag) {
      // Remove tag
      setCurrentTags(prev => prev.filter(ut => ut.tag.id !== tag.id));
      setPendingChanges(prev => ({
        toAdd: prev.toAdd.filter(t => t.id !== tag.id),
        toRemove: [...prev.toRemove.filter(id => id !== tag.id), tag.id]
      }));
    } else {
      // Add tag
      const newUserTag = {
        id: `usertag-${student.id}-${tag.id}`,
        userId: student.id,
        tagId: tag.id,
        tag,
        assignedAt: new Date(),
        assignedBy: user!,
        isActive: true,
        source: 'manual' as const
      };
      setCurrentTags(prev => [...prev, newUserTag]);
      setPendingChanges(prev => ({
        toAdd: [...prev.toAdd.filter(t => t.id !== tag.id), tag],
        toRemove: prev.toRemove.filter(id => id !== tag.id)
      }));
    }
  };

  const handleSave = async () => {
    if (saving || (!pendingChanges.toAdd.length && !pendingChanges.toRemove.length)) return;
    
    setSaving(true);
    try {
      // Apply removals
      for (const tagId of pendingChanges.toRemove) {
        studentService.removeTagFromStudent(student.id, tagId);
      }
      
      // Apply additions
      for (const tag of pendingChanges.toAdd) {
        studentService.addTagToStudent(student.id, tag, user!);
      }
      
      // Get updated student data
      const updatedStudent = studentService.getStudentById(student.id);
      if (updatedStudent) {
        onTagsUpdated(updatedStudent);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving tags:', error);
      alert('Erro ao salvar tags. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = pendingChanges.toAdd.length > 0 || pendingChanges.toRemove.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Editar Tags da Aluna
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {student.name}
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
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tags Disponíveis
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {mockAvailableTags.map((tag) => {
                  const hasTag = currentTags.some(ut => ut.tag.id === tag.id);
                  const isAdding = pendingChanges.toAdd.some(t => t.id === tag.id);
                  const isRemoving = pendingChanges.toRemove.includes(tag.id);
                  
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag)}
                      disabled={saving}
                      className={`
                        flex items-center p-3 rounded-lg border-2 transition-all duration-200
                        ${hasTag && !isRemoving
                          ? 'border-terracota bg-terracota/10 text-terracota' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-terracota/50'
                        }
                        ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}
                        ${isAdding ? 'ring-2 ring-green-400' : ''}
                        ${isRemoving ? 'ring-2 ring-red-400' : ''}
                      `}
                    >
                      <div 
                        className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                      />
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">{tag.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {tag.accessLevel === CourseAccessLevel.PREMIUM ? 'Premium' : 'Gratuito'}
                          {tag.hotmartProductId && ` • ID: ${tag.hotmartProductId}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAdding && (
                          <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded">
                            +
                          </div>
                        )}
                        {isRemoving && (
                          <div className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded">
                            -
                          </div>
                        )}
                        {hasTag && !isRemoving && (
                          <div className="w-5 h-5 bg-terracota rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Tags Preview */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tags Após Salvar ({currentTags.length})
              </h3>
              {currentTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentTags.map((userTag) => (
                    <span
                      key={userTag.id}
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
                  Nenhuma tag será atribuída à aluna
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {hasChanges && (
              <span className="text-orange-600 dark:text-orange-400">
                {pendingChanges.toAdd.length + pendingChanges.toRemove.length} alteração(ões) pendente(s)
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}