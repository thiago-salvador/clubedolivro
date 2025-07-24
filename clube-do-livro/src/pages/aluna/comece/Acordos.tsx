import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface Agreement {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

const Acordos: React.FC = () => {
  const { user } = useAuth();
  const [acceptedAgreements, setAcceptedAgreements] = useState<Set<string>>(new Set());
  const [hasAcceptedAll, setHasAcceptedAll] = useState(false);

  const agreements: Agreement[] = [
    {
      id: 'respeito',
      title: 'Respeito Mútuo',
      description: 'Tratamos todas as participantes com dignidade e consideração',
      icon: '🤝',
      details: [
        'Escutamos sem julgar as experiências compartilhadas',
        'Respeitamos diferentes perspectivas e vivências',
        'Usamos linguagem acolhedora e construtiva',
        'Valorizamos a diversidade de opiniões e backgrounds'
      ]
    },
    {
      id: 'confidencialidade',
      title: 'Confidencialidade',
      description: 'O que é compartilhado aqui, permanece aqui',
      icon: '🔒',
      details: [
        'Não compartilhamos histórias pessoais fora do grupo',
        'Mantemos a privacidade das participantes',
        'Respeitamos o anonimato quando solicitado',
        'Protegemos informações sensíveis compartilhadas'
      ]
    },
    {
      id: 'participacao',
      title: 'Participação Consciente',
      description: 'Contribuímos de forma positiva para o crescimento coletivo',
      icon: '🌱',
      details: [
        'Participamos com presença e intenção',
        'Compartilhamos quando nos sentimos confortáveis',
        'Respeitamos o tempo e espaço de outras participantes',
        'Contribuímos para um ambiente de aprendizado mútuo'
      ]
    },
    {
      id: 'crescimento',
      title: 'Abertura ao Crescimento',
      description: 'Estamos aqui para aprender, crescer e nos transformar',
      icon: '🦋',
      details: [
        'Mantemos mente aberta para novos insights',
        'Acolhemos o desconforto como parte do crescimento',
        'Celebramos as conquistas de todas as participantes',
        'Apoiamos umas às outras nos momentos desafiadores'
      ]
    },
    {
      id: 'autenticidade',
      title: 'Autenticidade',
      description: 'Encorajamos a expressão genuína do ser',
      icon: '✨',
      details: [
        'Valorizamos a verdade pessoal de cada uma',
        'Criamos espaço para vulnerabilidade segura',
        'Respeitamos diferentes ritmos de abertura',
        'Celebramos a coragem de ser autêntica'
      ]
    },
    {
      id: 'comunicacao',
      title: 'Comunicação Não-Violenta',
      description: 'Expressamos nossas necessidades de forma clara e gentil',
      icon: '💬',
      details: [
        'Falamos em primeira pessoa sobre nossas experiências',
        'Evitamos julgamentos e generalizações',
        'Pedimos esclarecimentos quando necessário',
        'Expressamos desacordo de forma respeitosa'
      ]
    }
  ];

  useEffect(() => {
    // Carregar acordos aceitos do localStorage
    const saved = localStorage.getItem('accepted_agreements');
    if (saved) {
      const accepted = new Set<string>(JSON.parse(saved));
      setAcceptedAgreements(accepted);
      setHasAcceptedAll(accepted.size === agreements.length);
    }
  }, []);

  const handleAgreementChange = (agreementId: string, accepted: boolean) => {
    const newAccepted = new Set(acceptedAgreements);
    if (accepted) {
      newAccepted.add(agreementId);
    } else {
      newAccepted.delete(agreementId);
    }
    
    setAcceptedAgreements(newAccepted);
    localStorage.setItem('accepted_agreements', JSON.stringify(Array.from(newAccepted)));
    setHasAcceptedAll(newAccepted.size === agreements.length);
  };

  const handleAcceptAll = () => {
    const allIds = new Set(agreements.map(a => a.id));
    setAcceptedAgreements(allIds);
    localStorage.setItem('accepted_agreements', JSON.stringify(Array.from(allIds)));
    setHasAcceptedAll(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>📋</span>
          Acordos do Grupo
        </h1>
        <p className="text-gray-700 leading-relaxed">
          Para garantir que todas se sintam seguras e acolhidas, estabelecemos alguns 
          acordos fundamentais. Estes não são regras rígidas, mas compromissos mútuos 
          para criar um espaço sagrado de crescimento e transformação.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Progresso dos Acordos
          </span>
          <span className="text-sm text-gray-600">
            {acceptedAgreements.size} de {agreements.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-terracota h-2 rounded-full transition-all duration-500"
            style={{ width: `${(acceptedAgreements.size / agreements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Agreements List */}
      <div className="space-y-4">
        {agreements.map((agreement) => {
          const isAccepted = acceptedAgreements.has(agreement.id);
          
          return (
            <div 
              key={agreement.id} 
              className={`bg-white rounded-xl p-6 shadow-sm transition-all duration-300 ${
                isAccepted ? 'ring-2 ring-terracota ring-opacity-30 bg-terracota/5' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isAccepted ? 'bg-terracota text-white' : 'bg-gray-100'
                  }`}>
                    <span className="text-2xl">{agreement.icon}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {agreement.title}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {agreement.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {agreement.details.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-terracota mt-1">•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAccepted}
                      onChange={(e) => handleAgreementChange(agreement.id, e.target.checked)}
                      className="w-5 h-5 text-terracota rounded focus:ring-terracota"
                    />
                    <span className={`font-medium transition-colors ${
                      isAccepted ? 'text-terracota' : 'text-gray-700'
                    }`}>
                      Aceito este acordo
                    </span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm text-gray-600">
            {hasAcceptedAll ? (
              <span className="flex items-center gap-2 text-green-600">
                <span>✅</span>
                Todos os acordos foram aceitos!
              </span>
            ) : (
              <span>
                Aceite todos os acordos para continuar sua jornada.
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            {!hasAcceptedAll && (
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
              >
                ✅ Aceitar Todos
              </button>
            )}
            
            {hasAcceptedAll && (
              <span className="px-6 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                🌟 Pronta para continuar!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>💡</span>
          Lembre-se:
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>
              Estes acordos criam a base para nossa comunidade acolhedora e transformadora
            </span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>
              Se sentir necessidade de conversar sobre qualquer acordo, nossa equipe está disponível
            </span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>
              Juntas, co-criamos um espaço sagrado para o despertar do feminino selvagem
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Acordos;