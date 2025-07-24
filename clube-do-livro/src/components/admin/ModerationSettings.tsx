import React, { useState, useEffect } from 'react';
import { X, Plus, AlertTriangle, Shield, Hash } from 'lucide-react';
import { moderationService } from '../../services/moderation.service';
import { DebateChannel } from '../../types/admin.types';

interface ModerationSettingsProps {
  channel?: DebateChannel;
  onChannelUpdate?: (bannedWords: string[]) => void;
}

export default function ModerationSettings({ channel, onChannelUpdate }: ModerationSettingsProps) {
  const [globalWords, setGlobalWords] = useState<string[]>([]);
  const [channelWords, setChannelWords] = useState<string[]>([]);
  const [newGlobalWord, setNewGlobalWord] = useState('');
  const [newChannelWord, setNewChannelWord] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState<{
    isApproved: boolean;
    blockedWords: string[];
    reason?: string;
  } | null>(null);

  useEffect(() => {
    // Carregar palavras globais
    setGlobalWords(moderationService.getGlobalBannedWords());
    
    // Carregar palavras do canal se fornecido
    if (channel?.bannedWords) {
      setChannelWords(channel.bannedWords);
    }
  }, [channel]);

  const handleAddGlobalWord = () => {
    if (newGlobalWord.trim()) {
      moderationService.addGlobalBannedWord(newGlobalWord);
      setGlobalWords(moderationService.getGlobalBannedWords());
      setNewGlobalWord('');
    }
  };

  const handleRemoveGlobalWord = (word: string) => {
    moderationService.removeGlobalBannedWord(word);
    setGlobalWords(moderationService.getGlobalBannedWords());
  };

  const handleAddChannelWord = () => {
    if (newChannelWord.trim() && channel) {
      const updatedWords = [...channelWords, newChannelWord.toLowerCase().trim()];
      setChannelWords(updatedWords);
      onChannelUpdate?.(updatedWords);
      setNewChannelWord('');
    }
  };

  const handleRemoveChannelWord = (word: string) => {
    if (channel) {
      const updatedWords = channelWords.filter(w => w !== word);
      setChannelWords(updatedWords);
      onChannelUpdate?.(updatedWords);
    }
  };

  const handleTestMessage = () => {
    if (testMessage.trim() && channel) {
      const result = moderationService.moderateMessage(testMessage, {
        ...channel,
        bannedWords: channelWords
      });
      setTestResult(result);
    }
  };

  const stats = moderationService.getModerationStats();

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-terracota" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Configurações de Moderação
        </h3>
      </div>

      {/* Palavras Banidas Globais */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Palavras Banidas Globalmente
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({stats.totalBannedWords} palavras)
          </span>
        </h4>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {globalWords.map((word) => (
            <span
              key={word}
              className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm"
            >
              {word}
              <button
                onClick={() => handleRemoveGlobalWord(word)}
                className="hover:text-red-900 dark:hover:text-red-300"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newGlobalWord}
            onChange={(e) => setNewGlobalWord(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddGlobalWord()}
            placeholder="Adicionar palavra..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-terracota"
          />
          <button
            onClick={handleAddGlobalWord}
            className="px-4 py-2 bg-terracota text-white rounded-md hover:bg-terracota/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </div>

      {/* Palavras Banidas do Canal */}
      {channel && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Hash className="w-4 h-4 text-blue-500" />
            Palavras Banidas no Canal "{channel.name}"
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({channelWords.length} palavras)
            </span>
          </h4>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {channelWords.map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-md text-sm"
              >
                {word}
                <button
                  onClick={() => handleRemoveChannelWord(word)}
                  className="hover:text-orange-900 dark:hover:text-orange-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newChannelWord}
              onChange={(e) => setNewChannelWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddChannelWord()}
              placeholder="Adicionar palavra específica do canal..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-terracota"
            />
            <button
              onClick={handleAddChannelWord}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Teste de Moderação */}
      {channel && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Testar Moderação
          </h4>
          
          <textarea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Digite uma mensagem para testar a moderação..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-terracota mb-3"
            rows={3}
          />

          <button
            onClick={handleTestMessage}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Testar Mensagem
          </button>

          {testResult && (
            <div className={`mt-3 p-3 rounded-md ${
              testResult.isApproved 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              <p className="font-medium">
                {testResult.isApproved ? '✅ Mensagem aprovada' : '❌ Mensagem bloqueada'}
              </p>
              {testResult.reason && (
                <p className="text-sm mt-1">Motivo: {testResult.reason}</p>
              )}
              {testResult.blockedWords.length > 0 && (
                <p className="text-sm mt-1">
                  Palavras bloqueadas: {testResult.blockedWords.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Informações */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          <strong>Dica:</strong> As palavras banidas globalmente se aplicam a todos os canais. 
          As palavras específicas do canal só se aplicam quando a moderação está ativada para aquele canal.
        </p>
      </div>
    </div>
  );
}