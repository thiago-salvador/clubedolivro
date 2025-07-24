import React, { useState, useEffect } from 'react';

interface SurveyData {
  rating: number;
  feedback?: string;
  timestamp: string;
  userId?: string;
  surveyType: 'weekly' | 'monthly' | 'after_chapter';
}

interface SatisfactionSurveyProps {
  surveyType: 'weekly' | 'monthly' | 'after_chapter';
  onClose: () => void;
}

const SatisfactionSurvey: React.FC<SatisfactionSurveyProps> = ({ surveyType, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const emojis = ['😞', '😕', '😐', '😊', '😍'];
  const labels = ['Muito Insatisfeita', 'Insatisfeita', 'Neutra', 'Satisfeita', 'Muito Satisfeita'];

  const getTitle = () => {
    switch (surveyType) {
      case 'weekly':
        return 'Como foi sua semana no Clube?';
      case 'monthly':
        return 'Como está sendo sua experiência este mês?';
      case 'after_chapter':
        return 'O que achou deste capítulo?';
      default:
        return 'Como está sua experiência?';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    setIsSubmitting(true);

    const surveyData: SurveyData = {
      rating,
      feedback: feedback.trim() || undefined,
      timestamp: new Date().toISOString(),
      userId: localStorage.getItem('userId') || undefined,
      surveyType
    };

    // Save survey response
    const existingSurveys = JSON.parse(localStorage.getItem('satisfaction_surveys') || '[]');
    existingSurveys.push(surveyData);
    localStorage.setItem('satisfaction_surveys', JSON.stringify(existingSurveys));

    // Update last survey timestamp
    localStorage.setItem(`last_${surveyType}_survey`, new Date().toISOString());

    // Log for analytics
    console.log('Survey submitted:', surveyData);

    setIsSubmitting(false);
    setShowThankYou(true);

    // Close after showing thank you
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleSkip = () => {
    // Record that survey was skipped
    localStorage.setItem(`last_${surveyType}_survey_skip`, new Date().toISOString());
    onClose();
  };

  if (showThankYou) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
          <div className="text-6xl mb-4">🙏</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Obrigada!</h3>
          <p className="text-gray-600">Sua opinião é muito importante para nós.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{getTitle()}</h2>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar pesquisa"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Selection */}
          <div>
            <p className="text-gray-700 mb-4 text-center">
              Avalie sua experiência:
            </p>
            
            {/* Emojis */}
            <div className="flex justify-center gap-2 sm:gap-4 mb-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setRating(index + 1)}
                  onMouseEnter={() => setHoveredRating(index + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className={`text-4xl sm:text-5xl transition-all duration-200 ${
                    rating === index + 1 
                      ? 'transform scale-125' 
                      : hoveredRating === index + 1
                      ? 'transform scale-110'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  aria-label={labels[index]}
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            {/* Label */}
            <p className="text-center text-sm text-gray-600 min-h-[20px]">
              {(hoveredRating || rating) ? labels[(hoveredRating || rating) - 1] : '\u00A0'}
            </p>
          </div>

          {/* Optional Feedback */}
          {rating > 0 && (
            <div className="space-y-2" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
              <label className="block text-sm font-medium text-gray-700">
                Quer compartilhar mais detalhes? (opcional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={
                  rating <= 2 
                    ? "Como podemos melhorar sua experiência?"
                    : rating === 3
                    ? "O que poderia ser melhor?"
                    : "O que você mais gostou?"
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent resize-none text-sm"
                maxLength={300}
              />
              <p className="text-xs text-gray-500 text-right">
                {feedback.length}/300 caracteres
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Pular
            </button>
            <button
              type="submit"
              disabled={!rating || isSubmitting}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                !rating || isSubmitting
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-terracota text-white hover:bg-marrom-escuro'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Suas respostas são anônimas e nos ajudam a melhorar.
        </p>
      </div>
    </div>
  );
};

// Hook to manage survey display logic
export const useSatisfactionSurvey = () => {
  const [showSurvey, setShowSurvey] = useState<'weekly' | 'monthly' | 'after_chapter' | null>(null);

  useEffect(() => {
    // Check if should show weekly survey (every 7 days)
    const lastWeeklySurvey = localStorage.getItem('last_weekly_survey');
    const lastWeeklySkip = localStorage.getItem('last_weekly_survey_skip');
    const lastWeekly = lastWeeklySurvey || lastWeeklySkip;
    
    if (!lastWeekly || new Date().getTime() - new Date(lastWeekly).getTime() > 7 * 24 * 60 * 60 * 1000) {
      setShowSurvey('weekly');
      return;
    }

    // Check if should show monthly survey (every 30 days)
    const lastMonthlySurvey = localStorage.getItem('last_monthly_survey');
    const lastMonthlySkip = localStorage.getItem('last_monthly_survey_skip');
    const lastMonthly = lastMonthlySurvey || lastMonthlySkip;
    
    if (!lastMonthly || new Date().getTime() - new Date(lastMonthly).getTime() > 30 * 24 * 60 * 60 * 1000) {
      setShowSurvey('monthly');
      return;
    }
  }, []);

  const closeSurvey = () => setShowSurvey(null);

  const showChapterSurvey = () => setShowSurvey('after_chapter');

  return {
    showSurvey,
    closeSurvey,
    showChapterSurvey,
    SurveyComponent: showSurvey ? (
      <SatisfactionSurvey surveyType={showSurvey} onClose={closeSurvey} />
    ) : null
  };
};

export default SatisfactionSurvey;