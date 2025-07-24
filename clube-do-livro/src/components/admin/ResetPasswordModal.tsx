import React, { useState } from 'react';
import { X, RefreshCw, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { StudentWithTags, studentService } from '../../services/student.service';
import { emailService } from '../../services/email.service';

interface ResetPasswordModalProps {
  student: StudentWithTags;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ResetPasswordModal({ student, onClose, onSuccess }: ResetPasswordModalProps) {
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  const handleSendResetEmail = async () => {
    if (sending) return;
    
    setSending(true);
    setError(null);
    
    try {
      // Generate reset token
      const resetToken = studentService.resetPassword(student.id);
      
      // Generate reset URL (in a real app, this would be a proper URL)
      const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(student.email)}`;
      
      // Send email
      await emailService.sendEmail({
        to: student.email,
        template: 'password_reset',
        data: {
          name: student.name,
          resetUrl,
          customMessage: customMessage.trim() || undefined
        }
      });
      
      setEmailSent(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      setError('Erro ao enviar email de redefinição. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  if (emailSent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Email Enviado!
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Email de Redefinição Enviado
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Um email com instruções para redefinir a senha foi enviado para:
                </p>
                <p className="font-medium text-gray-900 dark:text-white mt-2">
                  {student.email}
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Instruções:</strong> A aluna deve verificar a caixa de entrada (e spam) 
                  do email cadastrado e seguir as instruções para criar uma nova senha.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Resetar Senha
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Aluna: {student.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Um email com instruções para redefinir a senha será enviado para: 
              <span className="font-medium text-gray-900 dark:text-white ml-1">
                {student.email}
              </span>
            </p>
          </div>

          {/* Optional custom message */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mensagem personalizada (opcional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Ex: Entre em contato se tiver dificuldades..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {customMessage.length}/500 caracteres
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>
          )}

          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">Atenção:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Esta ação invalidará a senha atual da aluna</li>
                  <li>A aluna receberá um link temporário por email</li>
                  <li>O link expira em 24 horas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={sending}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSendResetEmail}
            disabled={sending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Enviar Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}