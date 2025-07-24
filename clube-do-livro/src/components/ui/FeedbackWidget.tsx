import React, { useState, useEffect } from 'react';

interface FeedbackData {
  type: 'bug' | 'idea' | 'other';
  message: string;
  page: string;
  timestamp: string;
  userId?: string;
}

const FeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'idea' | 'other'>('idea');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-hide success message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      type: feedbackType,
      message: message.trim(),
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      userId: localStorage.getItem('userId') || undefined
    };

    // Save to localStorage (in production, send to API)
    const existingFeedback = JSON.parse(localStorage.getItem('user_feedback') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('user_feedback', JSON.stringify(existingFeedback));

    // Log for analytics
    console.log('Feedback submitted:', feedbackData);

    // Reset form
    setMessage('');
    setFeedbackType('idea');
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const feedbackTypes = [
    { value: 'bug', label: '🐛 Reportar Problema', color: 'bg-red-100 text-red-800' },
    { value: 'idea', label: '💡 Sugestão', color: 'bg-blue-100 text-blue-800' },
    { value: 'other', label: '💬 Outro', color: 'bg-gray-100 text-gray-800' }
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-terracota hover:bg-marrom-escuro text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
        aria-label="Enviar feedback"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-2xl z-50" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
          <div className="p-6">
            {showSuccess ? (
              // Success Message
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Obrigada pelo feedback!</h3>
                <p className="text-gray-600">Sua opinião é muito importante para nós.</p>
              </div>
            ) : (
              // Feedback Form
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Como podemos melhorar?</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Fechar feedback"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Feedback Type Selection */}
                  <div className="flex gap-2">
                    {feedbackTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFeedbackType(type.value as any)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          feedbackType === type.value
                            ? type.color
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        feedbackType === 'bug'
                          ? 'Descreva o problema que você encontrou...'
                          : feedbackType === 'idea'
                          ? 'Compartilhe sua sugestão...'
                          : 'Digite seu feedback...'
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent resize-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {message.length}/500 caracteres
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!message.trim() || isSubmitting || message.length > 500}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      !message.trim() || isSubmitting || message.length > 500
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-terracota text-white hover:bg-marrom-escuro'
                    }`}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
                  </button>
                </form>

                {/* Privacy Note */}
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Seu feedback é anônimo e nos ajuda a melhorar a experiência.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;