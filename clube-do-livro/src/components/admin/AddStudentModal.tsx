import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Tag,
  Calendar,
  AlertCircle,
  CheckCircle,
  UserPlus
} from 'lucide-react';
import { studentService, StudentWithTags } from '../../services/student.service';
import { UserRole } from '../../types';
import { ProductTag, CourseAccessLevel } from '../../types/admin.types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentCreated: (student: StudentWithTags) => void;
}

interface StudentFormData {
  name: string;
  email: string;
  phoneNumber: string;
  notes: string;
  selectedTags: string[];
  isActive: boolean;
}

const initialFormData: StudentFormData = {
  name: '',
  email: '',
  phoneNumber: '',
  notes: '',
  selectedTags: [],
  isActive: true
};

export default function AddStudentModal({ isOpen, onClose, onStudentCreated }: AddStudentModalProps) {
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<StudentFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Mock tags - in a real app, these would come from an API or context
  const availableTags: ProductTag[] = [
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
      accessLevel: CourseAccessLevel.VIP, 
      color: '#DAA520',
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
      color: '#4D381B',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentFormData> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phoneNumber.trim() && !/^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{2}\s\d{4,5}-\d{4}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Telefone deve estar no formato (11) 99999-9999 ou 11 99999-9999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof StudentFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleTagToggle = (tagId: string) => {
    const currentTags = formData.selectedTags;
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    
    handleInputChange('selectedTags', newTags);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format based on length
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phoneNumber', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Create the student data
      const studentData: Omit<StudentWithTags, 'id'> = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=B8654B&color=fff`,
        role: UserRole.ALUNA,
        badges: [],
        joinedDate: new Date(),
        tags: formData.selectedTags.map(tagId => {
          const tag = availableTags.find(t => t.id === tagId)!;
          return {
            id: `usertag-${Date.now()}-${tagId}`,
            userId: '', // Will be set by the service
            tagId: tag.id,
            tag,
            assignedAt: new Date(),
            assignedBy: {
              id: 'admin',
              name: 'Administrador',
              email: 'admin@clubedolivronodiva.com.br',
              role: UserRole.ADMIN,
              badges: [],
              joinedDate: new Date()
            },
            isActive: true,
            source: 'manual'
          };
        }),
        lastActivity: new Date(),
        coursesEnrolled: 0,
        isActive: formData.isActive,
        phoneNumber: formData.phoneNumber.trim() || undefined,
        notes: formData.notes.trim() || undefined
      };

      // Create the student
      const createdStudent = studentService.createStudent(studentData);
      
      setSubmitSuccess(true);
      onStudentCreated(createdStudent);
      
      // Reset form after successful creation
      setTimeout(() => {
        setFormData(initialFormData);
        setSubmitSuccess(false);
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error creating student:', error);
      alert('Erro ao criar aluna. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData(initialFormData);
      setErrors({});
      setSubmitSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-terracota/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-terracota" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Nova Aluna
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cadastrar nova aluna manualmente
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Success Message */}
            {submitSuccess && (
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-800 dark:text-green-200">
                  Aluna criada com sucesso!
                </span>
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Digite o nome completo"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.name 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="aluna@email.com"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.email 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Contato
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Telefone (opcional)
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.phoneNumber 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Tags Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                <Tag className="w-5 h-5 inline mr-2" />
                Tags de Acesso
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableTags.map((tag) => (
                  <label
                    key={tag.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.selectedTags.includes(tag.id)
                        ? 'border-terracota bg-terracota/5'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedTags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="w-4 h-4 text-terracota border-gray-300 rounded focus:ring-terracota"
                      disabled={isSubmitting}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {tag.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        {tag.accessLevel}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Adicione observações sobre a aluna..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="w-4 h-4 text-terracota border-gray-300 rounded focus:ring-terracota"
                  disabled={isSubmitting}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Aluna ativa (pode acessar a plataforma)
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="px-6 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Criando...
                </>
              ) : submitSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Criado!
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Criar Aluna
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}